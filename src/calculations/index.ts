import { Data } from '../data/decoders';
import { calculatePastData } from './calculatePastData';
import { calculateFutureData } from './calculateFutureData';
import { calculateFuture401k } from './calculateFuture401k';
import Decimal from 'decimal.js';

export const runCalculations = (data: Data): string => {
	const pastData = calculatePastData(data);
	const futureData = calculateFutureData(data);
	const remainingAmount401k = new Decimal(
		data.legalData.contributionLimit401k
	).minus(pastData.total401kContribution);
	const [futureRate401k, futureAmount401k] = calculateFuture401k(
		remainingAmount401k,
		futureData.totalIncome
	);
	return `${pastData} ${futureData} ${futureRate401k} ${futureAmount401k}`;
};
