import { Context } from '../context';
import { calculatePastContribution401k } from './calculatePastContribution401k';
import { pipe } from 'fp-ts/function';
import { calculatePayrollTaxes } from './calculatePayrollTaxes';

export const performCalculations = (
	context: Omit<Context, 'pastContribution401k' | 'payrollTaxes'>
): Context =>
	pipe(calculatePastContribution401k(context), calculatePayrollTaxes);
