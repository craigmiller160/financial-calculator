import {
	BonusWithTotal,
	DataWithTotals,
	PaycheckWithTotal,
	PersonalDataWithTotals
} from '../totals/TotalTypes';
import Decimal from 'decimal.js';
import { PredicateT } from '@craigmiller160/ts-functions/types';
import { pipe } from 'fp-ts/function';
import * as Pred from 'fp-ts/Predicate';
import * as RArray from 'fp-ts/ReadonlyArray';
import produce, { castDraft } from 'immer';

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
const isOver401kLimit: PredicateT<Context> = pipe(
	noAmount401k,
	Pred.or(tooHighAmount401k)
);

const findRate401k = (context: Context): Decimal => {
	const newRate = context.rate401k.plus(INTERVAL);
	const newAmount = context.totalFutureIncome.times(newRate);
	const newContext: Context = {
		...context,
		amount401k: newAmount,
		rate401k: newRate
	};
	if (isOver401kLimit(newContext)) {
		return newRate.minus(INTERVAL);
	}
	return findRate401k(newContext);
};

const add401kToPaycheck =
	(rate: Decimal) =>
	(paycheck: PaycheckWithTotal): PaycheckWithTotal => {
		const amount401k = new Decimal(paycheck.grossPay)
			.times(rate)
			.toNumber();
		return {
			...paycheck,
			paycheck401k: {
				rate: rate.toNumber(),
				amount: amount401k
			},
			totalsForAllChecks: {
				...paycheck.totalsForAllChecks,
				contribution401k: new Decimal(amount401k)
					.times(paycheck.numberOfChecks)
					.toNumber()
			}
		};
	};

const add401kToBonus =
	(rate: Decimal) =>
	(bonus: BonusWithTotal): BonusWithTotal => {
		const amount401k = new Decimal(bonus.grossPay).times(rate).toNumber();
		return {
			...bonus,
			bonus401k: {
				rate: rate.toNumber(),
				amount: amount401k
			}
		};
	};

export const addFuture401k = (data: DataWithTotals): PersonalDataWithTotals => {
	const remainingAmount401k = new Decimal(
		data.legalData.contributionLimit401k -
			data.personalData.totals.past.contribution401k
	);
	const totalFutureIncome = new Decimal(
		data.personalData.totals.future.grossPay
	);
	const initContext: Context = {
		remainingAmount401k,
		totalFutureIncome,
		rate401k: new Decimal(INTERVAL),
		amount401k: new Decimal(0)
	};
	const rate = findRate401k(initContext);
	const futurePaychecks = pipe(
		data.personalData.futurePaychecks,
		RArray.map(add401kToPaycheck(rate))
	);
	const futureBonuses = pipe(
		data.personalData.futureBonuses,
		RArray.map(add401kToBonus(rate))
	);
	const futureContribution401k = new Decimal(
		data.personalData.totals.future.grossPay
	)
		.times(rate)
		.toNumber();
	return produce(data.personalData, (draft) => {
		draft.futurePaychecks = castDraft(futurePaychecks);
		draft.futureBonuses = castDraft(futureBonuses);
		draft.totals.future.contribution401k = futureContribution401k;
		draft.futureRate401k = rate.toNumber();
	});
};
