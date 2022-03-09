import { Data } from '../data/decoders';
import { calculatePastData } from './calculatePastData';
import { calculateFutureData } from './calculateFutureData';

/* eslint-disable  */
export const runCalculations = (data: Data): string => {
	const pastData = calculatePastData(data);
	const futureData = calculateFutureData(data);
	return '';
};
