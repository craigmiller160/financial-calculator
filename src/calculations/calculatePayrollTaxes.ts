import { Context } from '../context';

export const calculatePayrollTaxes = (
	context: Omit<Context, 'payrollTaxes'>
): Context => {
	throw new Error();
};
