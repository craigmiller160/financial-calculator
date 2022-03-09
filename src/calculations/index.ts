import { Data } from '../data/decoders';
import { calculatePastData } from './calculatePastData';
import { calculateFutureData } from './calculateFutureData';

export const runCalculations = (data: Data): string => {
	const pastData = calculatePastData(data);
	const futureData = calculateFutureData(data);
	return '';
};
