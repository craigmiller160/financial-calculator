import { Data, LegalData } from '../data/decoders';
import { IOT, IOTryT } from '@craigmiller160/ts-functions/types';
import { pipe } from 'fp-ts/function';
import { logger } from '../logger';
import * as IO from 'fp-ts/IO';
import { addTotalsToData } from './totals/addTotalsToData';
import { PersonalDataWithTotals } from './totals/TotalTypes';
import { addFuture401k } from './401k/addFuture401k';
import * as IOEither from 'fp-ts/IOEither';
import { addAgi } from './agi/addAgi';
import { addCombinedTotals } from './combinedTotals/addCombinedTotals';
import { addMagi } from './agi/addMagi';
import { addFederalTaxes } from './taxes/addFederalTaxes';
import { addTakeHomePay } from './takeHome/addTakeHomePay';
import { addRothIraLimit } from './rothIRA/addRothIraLimit';

const runCalculationsForTotals = (data: Data): IOT<PersonalDataWithTotals> =>
	pipe(
		logger.debug('Calculating total values for data'),
		IO.map(() => addTotalsToData(data)),
		IO.chainFirst((data) => logger.debugWithJson('Data', data))
	);

const runCalculationsForFuture401k =
	(legalData: LegalData) =>
	(personalData: PersonalDataWithTotals): IOT<PersonalDataWithTotals> =>
		pipe(
			logger.debug('Calculating future 401k rates and amounts'),
			IO.map(() => addFuture401k({ legalData, personalData })),
			IO.chainFirst((dataWithTotals) =>
				logger.debugWithJson('Data', dataWithTotals)
			)
		);

const runCalculationsForAgiMagi = (
	personalData: PersonalDataWithTotals
): IOT<PersonalDataWithTotals> =>
	pipe(
		logger.debug('Calculating AGI'),
		IO.map(() => addAgi(personalData)),
		IO.chainFirst(() => logger.debug('Calculating MAGI')),
		IO.map(addMagi),
		IO.chainFirst((data) => logger.debugWithJson('Data', data))
	);

const runCalculationsForCombinedTotals = (
	personalData: PersonalDataWithTotals
): IOT<PersonalDataWithTotals> =>
	pipe(
		logger.debug('Calculating Combined Totals'),
		IO.map(() => addCombinedTotals(personalData)),
		IO.chainFirst((data) => logger.debugWithJson('Data', data))
	);

const runCalculationsForFederalTaxes =
	(legalData: LegalData) =>
	(personalData: PersonalDataWithTotals): IOTryT<PersonalDataWithTotals> =>
		pipe(
			logger.debug('Calculating Federal Taxes'),
			IOEither.rightIO,
			IOEither.chainEitherK(() =>
				addFederalTaxes({ personalData, legalData })
			),
			IOEither.chainFirstIOK((data) => logger.debugWithJson('Data', data))
		);

const runCalculationsForTakeHomePay = (
	personalData: PersonalDataWithTotals
): IOT<PersonalDataWithTotals> =>
	pipe(
		logger.debug('Calculating Take Home Pay'),
		IO.map(() => addTakeHomePay(personalData)),
		IO.chainFirst((data) => logger.debugWithJson('Data', data))
	);

const runCalculationsForRothIraLimit =
	(legalData: LegalData) =>
	(personalData: PersonalDataWithTotals): IOT<PersonalDataWithTotals> =>
		pipe(
			logger.debug('Calculating Roth IRA Limit'),
			IO.map(() => addRothIraLimit({ legalData, personalData })),
			IO.chainFirst((data) => logger.debugWithJson('Data', data))
		);

export const runCalculations = (data: Data): IOTryT<PersonalDataWithTotals> =>
	pipe(
		runCalculationsForTotals(data),
		IO.chain(runCalculationsForCombinedTotals),
		IO.chain(runCalculationsForFuture401k(data.legalData)),
		IO.chain(runCalculationsForCombinedTotals),
		IO.chain(runCalculationsForAgiMagi),
		IO.chain(runCalculationsForCombinedTotals),
		IOEither.rightIO,
		IOEither.chain(runCalculationsForFederalTaxes(data.legalData)),
		IOEither.chainIOK(runCalculationsForTakeHomePay),
		IOEither.chainIOK(runCalculationsForCombinedTotals),
		IOEither.chainIOK(runCalculationsForRothIraLimit(data.legalData))
	);
