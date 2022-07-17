import path from 'path';

export const PAST_CONTRIBUTION_401K_FILE = 'pastContribution401k.json';
export const PAYROLL_TAXES_FILE = 'payrollTaxes.json';
export const FUTURE_CONTRIBUTION_401K_FILE = 'futureContribution401k.json';

export const createOutputPath = (cwd: string): string =>
	path.join(cwd, 'output');
