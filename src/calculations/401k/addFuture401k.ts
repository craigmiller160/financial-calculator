import {
	BonusWithTotal,
	DataWithTotals,
	PaycheckWithTotal
} from '../totals/TotalTypes';
import Decimal from 'decimal.js';
import { PredicateT } from '@craigmiller160/ts-functions/types';
import { pipe } from 'fp-ts/function';
import * as Pred from 'fp-ts/Predicate';
import * as RArray from 'fp-ts/ReadonlyArray';

interface Context {
	readonly remainingAmount401k: Decimal;
	readonly totalFutureIncome: Decimal;
	readonly rate401k: Decimal;
	readonly amount401k: Decimal;
}

// 0.1%
const INTERVAL = new Decimal(0.001);

// TODO add tests for both of these scenarios
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
		const taxablePay = new Decimal(paycheck.taxablePay)
			.minus(new Decimal(amount401k))
			.toNumber();
		return {
			...paycheck,
			paycheck401k: {
				rate: rate.toNumber(),
				amount: amount401k
			},
			taxablePay,
			totalsForAllChecks: {
				...paycheck.totalsForAllChecks,
				taxablePay: new Decimal(taxablePay)
					.times(paycheck.numberOfChecks)
					.toNumber(),
				contribution401k: new Decimal(amount401k)
					.times(paycheck.numberOfChecks)
					.toNumber()
			},
			annualized: {
				...paycheck.annualized,
				taxablePay: new Decimal(taxablePay).times(26).toNumber()
			}
		};
	};

const add401kToBonus =
	(rate: Decimal) =>
	(bonus: BonusWithTotal): BonusWithTotal => {
		const amount401k = new Decimal(bonus.grossPay).times(rate).toNumber();
		const taxablePay = new Decimal(bonus.taxablePay)
			.minus(amount401k)
			.toNumber();
		return {
			...bonus,
			bonus401k: {
				rate: rate.toNumber(),
				amount: amount401k
			},
			taxablePay
		};
	};

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
		data.personalData.totals.futureGrossPay
	)
		.times(rate)
		.toNumber();
	const futureTaxablePay = new Decimal(
		data.personalData.totals.futureTaxablePay
	)
		.minus(futureContribution401k)
		.toNumber();
	return {
		...data,
		personalData: {
			...data.personalData,
			futurePaychecks,
			futureBonuses,
			totals: {
				...data.personalData.totals,
				futureContribution401k,
				futureTaxablePay
			},
			futureRate401k: rate.toNumber()
		}
	};
};
