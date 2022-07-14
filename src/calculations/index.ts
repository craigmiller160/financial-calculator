import { Context } from '../context';
import { calculatePastContribution401k } from './calculatePastContribution401k';

export const performCalculations = (
	context: Omit<Context, 'pastContribution401k'>
): Context => calculatePastContribution401k(context);
