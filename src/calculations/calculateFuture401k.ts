import * as Loop from '../function/Loop';
import Decimal from 'decimal.js';
import { PredicateT } from '@craigmiller160/ts-functions/types';
import * as Pred from 'fp-ts/Predicate';
import { pipe } from 'fp-ts/function';

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

export const calculateFuture401k = (
	remainingAmount401k: Decimal,
	totalFutureIncome: Decimal
): [rate: Decimal, amount: Decimal] => {
	const initContext: Context = {
		remainingAmount401k,
		totalFutureIncome,
		rate401k: new Decimal(0),
		amount401k: new Decimal(0)
	};
	const resultContext = Loop.runUntil<Context>(
		pipe(noAmount401k, Pred.or(tooHighAmount401k))
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
