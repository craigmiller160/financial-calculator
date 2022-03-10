import {
	BonusWithTotal,
	CombinedTotals,
	PaycheckWithTotal
} from './TotalTypes';
import { MonoidT } from '@craigmiller160/ts-functions/types';
import * as Monoid from 'fp-ts/Monoid';
import * as RArray from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';

const combinedTotalsMonoid: MonoidT<CombinedTotals> = {
	empty: {
		grossPay: 0,
		contribution401k: 0,
		taxablePay: 0
	},
	concat: (a, b) => ({
		grossPay: a.grossPay + b.grossPay,
		contribution401k: a.contribution401k + b.contribution401k,
		taxablePay: a.taxablePay + b.taxablePay
	})
};

const paycheckToCombinedTotal = (
	paycheck: PaycheckWithTotal
): CombinedTotals => ({
	grossPay: paycheck.totalsForAllChecks.grossPay,
	contribution401k: paycheck.totalsForAllChecks.contribution401k,
	taxablePay: paycheck.totalsForAllChecks.taxablePay
});

const bonusToCombinedTotal = (bonus: BonusWithTotal): CombinedTotals => ({
	grossPay: bonus.grossPay,
	contribution401k: bonus.bonus401k.amount,
	taxablePay: bonus.taxablePay
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
