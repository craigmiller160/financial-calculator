import {
	BonusWithTotal,
	CombinedTotals,
	PaycheckWithTotal
} from '../totals/TotalTypes';
import { MonoidT } from '@craigmiller160/ts-functions/types';
import * as Monoid from 'fp-ts/Monoid';
import * as RArray from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import Decimal from 'decimal.js';

const decimalAdd = (a: number, b: number): number =>
	new Decimal(a).plus(new Decimal(b)).toNumber();

const combinedTotalsMonoid: MonoidT<CombinedTotals> = {
	empty: {
		grossPay: 0,
		contribution401k: 0,
		estimatedAGI: 0,
		estimatedMAGI: 0,
		estimatedTakeHomePay: 0,
		contributionHsa: 0
	},
	concat: (a, b) => ({
		grossPay: decimalAdd(a.grossPay, b.grossPay),
		contribution401k: decimalAdd(a.contribution401k, b.contribution401k),
		estimatedAGI: decimalAdd(a.estimatedAGI, b.estimatedAGI),
		estimatedMAGI: decimalAdd(a.estimatedMAGI, b.estimatedMAGI),
		estimatedTakeHomePay: decimalAdd(
			a.estimatedTakeHomePay,
			b.estimatedTakeHomePay
		),
		contributionHsa: decimalAdd(a.contributionHsa, b.contributionHsa)
	})
};

const paycheckToCombinedTotal = (
	paycheck: PaycheckWithTotal
): CombinedTotals => ({
	grossPay: paycheck.totalsForAllChecks.grossPay,
	contribution401k: paycheck.totalsForAllChecks.contribution401k,
	estimatedAGI: paycheck.totalsForAllChecks.estimatedAGI,
	estimatedMAGI: paycheck.totalsForAllChecks.estimatedMAGI,
	estimatedTakeHomePay: paycheck.totalsForAllChecks.estimatedTakeHomePay,
	contributionHsa: paycheck.totalsForAllChecks.contributionHsa
});

const bonusToCombinedTotal = (bonus: BonusWithTotal): CombinedTotals => ({
	grossPay: bonus.grossPay,
	contribution401k: bonus.bonus401k.amount,
	estimatedAGI: bonus.estimatedAGI,
	estimatedMAGI: bonus.estimatedMAGI,
	estimatedTakeHomePay: bonus.estimatedTakeHomePay,
	contributionHsa: 0
});

export const getCombinedTotalsForPaychecks = (
	paychecks: ReadonlyArray<PaycheckWithTotal>
): CombinedTotals =>
	pipe(
		paychecks,
		RArray.map(paycheckToCombinedTotal),
		Monoid.concatAll(combinedTotalsMonoid)
	);

export const getCombinedTotalsForBonuses = (
	bonuses: ReadonlyArray<BonusWithTotal>
): CombinedTotals =>
	pipe(
		bonuses,
		RArray.map(bonusToCombinedTotal),
		Monoid.concatAll(combinedTotalsMonoid)
	);
