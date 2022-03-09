import * as Loop from '../function/Loop';
import Decimal from 'decimal.js';

interface Context {
	readonly remainingAmount401k: Decimal;
	readonly totalFutureIncome: Decimal;
	readonly rate401k: Decimal;
	readonly amount401k: Decimal;
}

// 0.1%
const INTERVAL = new Decimal(0.001);

export const calculateFuture401k = (
	remainingAmount401k: number,
	totalFutureIncome: number
): [rate: Decimal, amount: Decimal] => {
	// TODO if I change all values to Decimals, fix this
	const initContext: Context = {
		remainingAmount401k: new Decimal(remainingAmount401k),
		totalFutureIncome: new Decimal(totalFutureIncome),
		rate401k: new Decimal(0),
		amount401k: new Decimal(0)
	};
	const resultContext = Loop.runUntil<Context>(
		(ctx) => ctx.amount401k.comparedTo(ctx.remainingAmount401k) > 0
	)((ctx) => {
		const newRate = ctx.rate401k.plus(INTERVAL);
		const newAmount = ctx.totalFutureIncome.times(newRate);
		return {
			...ctx,
			rate401k: newRate,
			amount401k: newAmount
		};
	})(initContext);
	const finalRate = resultContext.rate401k.minus(INTERVAL);
	const finalAmount = new Decimal(totalFutureIncome).times(finalRate);
	return [finalRate, finalAmount];
};
