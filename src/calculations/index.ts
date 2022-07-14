import { Context } from '../context';
import { calculatePastContribution401k } from './calculatePastContribution401k';
import { pipe } from 'fp-ts/function';
import { calculatePayrollTaxes } from './calculatePayrollTaxes';
import { logger } from '../logger';

export const performCalculations = (
	context: Omit<Context, 'pastContribution401k' | 'payrollTaxes'>
): Context => {
	logger.debug('Performing calculations on data');
	return pipe(calculatePastContribution401k(context), calculatePayrollTaxes);
};
