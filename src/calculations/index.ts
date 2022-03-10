import { Data } from '../data/decoders';
import { IOT, IOTryT } from '@craigmiller160/ts-functions/types';
import { pipe } from 'fp-ts/function';
import { logger } from '../logger';
import * as IO from 'fp-ts/IO';
import { addTotalsToData } from './totals/addTotalsToData';
import { DataWithTotals } from './totals/TotalTypes';
import { addFuture401k } from './401k/addFuture401k';
import * as IOEither from 'fp-ts/IOEither';
import { addTaxes } from './taxes/addTaxes';

const runCalculationsForTotals = (data: Data): IOT<DataWithTotals> =>
	pipe(
		logger.debug('Calculating total values for data'),
		IO.map(() => addTotalsToData(data)),
		IO.chainFirst((data) => logger.debugWithJson('Data With Totals', data))
	);

const runCalculationsForFuture401k = (
	data: DataWithTotals
): IOT<DataWithTotals> =>
	pipe(
		logger.debug('Calculating future 401k rates and amounts'),
		IO.map(() => addFuture401k(data)),
		IO.chainFirst((dataWithTotals) =>
			logger.debugWithJson('Data with Future 401k', dataWithTotals)
		)
	);

const runCalculationsForTaxes = (
	data: DataWithTotals
): IOTryT<DataWithTotals> =>
	pipe(
		logger.debug('Calculating taxes'),
		IOEither.rightIO,
		IOEither.chainEitherK(() => addTaxes(data))
	);

export const runCalculations = (data: Data): IOTryT<string> =>
	pipe(
		runCalculationsForTotals(data),
		IO.chain(runCalculationsForFuture401k),
		IOEither.rightIO,
		IOEither.chain(runCalculationsForTaxes),
		IOEither.map((data) => `${data.personalData.futureRate401k}`)
	);
