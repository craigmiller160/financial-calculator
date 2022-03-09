import * as Loop from '../function/Loop';

interface Context {
	readonly remainingAmount401k: number;
	readonly totalFutureIncome: number;
	readonly rate401k: number;
	readonly amount401k: number;
}

// 0.1%
const INTERVAL = 0.001;

export const calculateFuture401k = (
	remainingAmount401k: number,
	totalFutureIncome: number
): [rate: number, amount: number] => {
	const initContext: Context = {
		remainingAmount401k,
		totalFutureIncome,
		rate401k: 0,
		amount401k: 0
	};
	const resultContext = Loop.runUntil<Context>(
		(ctx) => ctx.amount401k > ctx.remainingAmount401k
	)((ctx) => {
		const newRate = ctx.rate401k + INTERVAL;
		const newAmount = ctx.totalFutureIncome * newRate;
		return {
			...ctx,
			rate401k: newRate,
			amount401k: newAmount
		};
	})(initContext);
	const finalRate = resultContext.rate401k - INTERVAL;
	const finalAmount = totalFutureIncome * finalRate;
	return [finalRate, finalAmount];
};
