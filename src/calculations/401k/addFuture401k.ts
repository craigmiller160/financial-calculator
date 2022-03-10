import { DataWithTotals } from '../totals/TotalTypes';
import Decimal from 'decimal.js';
import { PredicateT } from '@craigmiller160/ts-functions/types';

interface Context {
	readonly remainingAmount401k: Decimal;
	readonly totalFutureIncome: Decimal;
	readonly rate401k: Decimal;
	readonly amount401k: Decimal;
}

// 0.1%
const INTERVAL = new Decimal(0.001);

const noAmount401k: PredicateT<Context> = (ctx) =>
	ctx.amount401k.eq(new Decimal(0));
const tooHighAmount401k: PredicateT<Context> = (ctx) =>
	ctx.amount401k.comparedTo(ctx.remainingAmount401k) > 0;

export const addFuture401k = (data: DataWithTotals): DataWithTotals => {
	const remainingAmount401k = new Decimal(
		data.legalData.contributionLimit401k -
			data.personalData.totals.pastContribution401k
	);
	const totalFutureIncome = new Decimal(
		data.personalData.totals.futureGrossPay
	);
	const initContext: Context = {
		remainingAmount401k,
		totalFutureIncome,
		rate401k: new Decimal(0),
		amount401k: new Decimal(0)
	};
};
