import { Data } from '../data/decoders';
import { calculatePastData } from './calculatePastData';
import { calculateFutureData } from './calculateFutureData';
import { calculateFuture401k } from './calculateFuture401k';
import Decimal from 'decimal.js';
import { IOT } from '@craigmiller160/ts-functions/types';
import { FutureData, PastData } from './CalculationTypes';
import { pipe } from 'fp-ts/function';
import { logger } from '../logger';
import * as IO from 'fp-ts/IO';

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

export const runCalculations = (data: Data): IOT<string> =>
	pipe(
		runPastDataCalculation(data),
		IO.bindTo('pastData'),
		IO.bind('futureData', () => runFutureDataCalculation(data)),
		IO.bind('future401k', ({ pastData, futureData }) =>
			runFuture401kCalculation(data, pastData, futureData)
		),
		IO.bind('printableRate401k', ({ future401k }) =>
			IO.of(`${future401k.times(100).toNumber().toFixed(2)}%`)
		),
		IO.map(({ printableRate401k }) => printableRate401k)
	);
