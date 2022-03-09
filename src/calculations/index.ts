import { PersonalData } from '../data/decoders';
import { calculatePastData } from './calculatePastData';
import { calculateFutureData } from './calculateFutureData';

/* eslint-disable  */
export const runCalculations = (data: PersonalData): string => {
	const pastData = calculatePastData(data);
	const futureData = calculateFutureData(data);
	return '';
};
