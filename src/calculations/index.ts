import { BaseContext, Context } from '../context';
import { calculatePastContribution401k } from './calculatePastContribution401k';
import { calculatePayrollTaxes } from './calculatePayrollTaxes';
import { logger } from '../logger';
import { calculateFuture401kRate } from './calculateFuture401kRate';

export const performCalculations = (context: BaseContext): Context => {
	logger.debug('Performing calculations on data');
	const pastContribution401k = calculatePastContribution401k(context);
	const payrollTaxes = calculatePayrollTaxes(context);
	const future401kRate = calculateFuture401kRate(context);
	return {
		...context,
		pastContribution401k,
		payrollTaxes,
		future401kRate
	};
};
