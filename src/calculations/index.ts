import { Data } from '../data/decoders';
import { calculatePastData } from './calculatePastData';
import { calculateFutureData } from './calculateFutureData';
import { calculateFuture401k } from './calculateFuture401k';

export const runCalculations = (data: Data): string => {
	const pastData = calculatePastData(data);
	const futureData = calculateFutureData(data);
	const [futureRate401k, futureAmount401k] = calculateFuture401k(
		data.legalData.contributionLimit401k,
		futureData.totalIncome
	);
	return `${pastData} ${futureData} ${futureRate401k} ${futureAmount401k}`;
};
