import { BaseContext, Context } from '../context';
import { calculatePastContribution401k } from './calculatePastContribution401k';
import { calculatePayrollTaxes } from './calculatePayrollTaxes';
import { logger } from '../logger';
import { calculateFuture401kRate } from './calculateFuture401kRate';
import { pipe } from 'fp-ts/function';
import * as Either from 'fp-ts/Either';
import { TryT } from '@craigmiller160/ts-functions/types';
import { calculateFutureContribution401k } from './calculateFutureContribution401k';

export const performCalculations = (context: BaseContext): TryT<Context> => {
	logger.debug('Performing calculations on data');
	const pastContribution401k = calculatePastContribution401k(context);
	const payrollTaxes = calculatePayrollTaxes(context);
	return pipe(
		calculateFuture401kRate(context, pastContribution401k),
		Either.bindTo('futureRate401k'),
		Either.bind('futureContribution401k', ({ futureRate401k }) =>
			Either.right(
				calculateFutureContribution401k(context, futureRate401k)
			)
		),
		Either.map(
			({ futureRate401k, futureContribution401k }): Context => ({
				...context,
				pastContribution401k,
				payrollTaxes,
				futureContribution401k,
				futureRate401k
			})
		)
	);
};
