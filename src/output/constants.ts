import path from 'path';

export const PAST_CONTRIBUTION_401K_FILE = 'pastContribution401k.json';

export const createOutputPath = (cwd: string): string =>
	path.join(cwd, 'output');
