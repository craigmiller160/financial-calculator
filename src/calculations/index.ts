import { Data } from '../data/decoders';
import { calculatePastData } from './calculatePastData';
import { calculateFutureData } from './calculateFutureData';
import { calculateFuture401k } from './calculateFuture401k';
import Decimal from 'decimal.js';
import { IOT } from '@craigmiller160/ts-functions/types';
import { Calculations401k, FutureData, PastData } from './CalculationTypes';
import { pipe } from 'fp-ts/function';
import { logger } from '../logger';
import * as IO from 'fp-ts/IO';
import { addTotalsToData } from './totals/addTotalsToData';
import { DataWithTotals } from './totals/TotalTypes';
import { addFuture401k } from './401k/addFuture401k';

const runPastDataCalculation = (data: Data): IOT<PastData> =>
	pipe(
		logger.debug('Calculating past data'),
		IO.map(() => calculatePastData(data))
	);

const runFutureDataCalculation = (data: Data): IOT<FutureData> =>
	pipe(
		logger.debug('Calculating future data'),
		IO.map(() => calculateFutureData(data))
	);

const runFuture401kCalculation = (
	data: Data,
	pastData: PastData,
	futureData: FutureData
): IOT<Decimal> =>
	pipe(
		logger.debug('Calculating future 401k contribution'),
		IO.map(() => {
			const remainingAmount401k = new Decimal(
				data.legalData.contributionLimit401k
			).minus(pastData.total401kContribution);
			return calculateFuture401k(
				remainingAmount401k,
				futureData.totalIncome
			);
		})
	);

const runCalculationsFor401k = (data: Data): IOT<Calculations401k> =>
	pipe(
		runPastDataCalculation(data),
		IO.bindTo('pastData'),
		IO.bind('futureData', () => runFutureDataCalculation(data)),
		IO.bind('future401kRate', ({ pastData, futureData }) =>
			runFuture401kCalculation(data, pastData, futureData)
		)
	);

// TODO delete a lot of old calculations above

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
		IO.chainFirst((data) =>
			logger.debugWithJson('Data with Future 401k', data)
		)
	);

export const runCalculations = (data: Data): IOT<string> =>
	pipe(
		runCalculationsForTotals(data),
		IO.chain(runCalculationsForFuture401k),
		IO.map(
			(data) => data.personalData.futurePaychecks[0].paycheck401k.rate
		),
		IO.map((value) => `${value}`)
	);
