import { Data } from '../data/decoders';
import { IOT } from '@craigmiller160/ts-functions/types';
import { pipe } from 'fp-ts/function';
import { logger } from '../logger';
import * as IO from 'fp-ts/IO';
import { addTotalsToData } from './totals/addTotalsToData';
import { DataWithTotals } from './totals/TotalTypes';
import { addFuture401k } from './401k/addFuture401k';

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

export const runCalculations = (data: Data): IOT<string> =>
	pipe(
		runCalculationsForTotals(data),
		IO.chain(runCalculationsForFuture401k),
		// TODO need to expose future 401k rate separately
		IO.map(
			(data) => data.personalData.futurePaychecks[0].paycheck401k.rate
		),
		IO.map((value) => `${value}`)
	);
