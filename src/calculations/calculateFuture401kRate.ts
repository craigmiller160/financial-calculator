import { BaseContext } from '../context';
import {
	Contribution401k,
	Contribution401kByItem
} from '../context/contribution401k';
import { Bonus, Paycheck } from '../data/decoders/personalData';
import { findNamedItemE } from '../utils/finders';
import { pipe } from 'fp-ts/function';
import * as Either from 'fp-ts/Either';
import { MonoidT, PredicateT, TryT } from '@craigmiller160/ts-functions/types';
import { decimalMonoidSum, minus, plus, times } from '../utils/decimalMath';
import * as RArray from 'fp-ts/ReadonlyArray';
import * as Monoid from 'fp-ts/Monoid';

// 0.1%
const INTERVAL_FIND_401K = 0.001;

type UnnamedContribution401kItem = Omit<Contribution401kByItem, 'name'>;

const contribution401kMonoid: MonoidT<UnnamedContribution401kItem> = {
	empty: {
		employerContribution: 0,
		employeeContribution: 0
	},
	concat: (a, b) => ({
		employerContribution: plus(a.employerContribution)(
			b.employerContribution
		),
		employeeContribution: plus(a.employeeContribution)(
			b.employeeContribution
		)
	})
};

const getTotalContributionForAllChecks =
	(paychecks: ReadonlyArray<Paycheck>) =>
	(contribution: Contribution401kByItem): TryT<Contribution401kByItem> =>
		pipe(
			findNamedItemE(paychecks)(contribution.name),
			Either.map(
				(paycheck): Contribution401kByItem => ({
					name: contribution.name,
					employeeContribution: times(paycheck.numberOfChecks)(
						contribution.employeeContribution
					),
					employerContribution: times(paycheck.numberOfChecks)(
						contribution.employerContribution
					)
				})
			)
		);

const getTotalPastContribution = (
	context: BaseContext,
	pastContributions401k: Contribution401k
): TryT<UnnamedContribution401kItem> => {
	const pastPaycheckTotal401k = pipe(
		pastContributions401k.contributionsByPaycheck,
		RArray.map(
			getTotalContributionForAllChecks(context.personalData.pastPaychecks)
		),
		Either.sequenceArray,
		Either.map(Monoid.concatAll(contribution401kMonoid))
	);
	const pastBonusTotal401k = pipe(
		pastContributions401k.contributionsByBonus,
		Monoid.concatAll(contribution401kMonoid)
	);
	return pipe(
		pastPaycheckTotal401k,
		Either.map((pastPaycheckTotal) => ({
			employeeContribution: plus(pastPaycheckTotal.employeeContribution)(
				pastBonusTotal401k.employeeContribution
			),
			employerContribution: plus(pastPaycheckTotal.employerContribution)(
				pastBonusTotal401k.employerContribution
			)
		}))
	);
};

interface FindRateValues {
	readonly contributionLimit401k: number;
	readonly newRate401k: number;
	readonly newFutureContribution401k: number;
	readonly totalPastContribution401k: number;
	readonly totalFutureIncomeFor401k: number;
}

const isOver401kLimit: PredicateT<FindRateValues> = (values) => {
	const totalContribution = plus(values.totalPastContribution401k)(
		values.newFutureContribution401k
	);
	return totalContribution > values.contributionLimit401k;
};

const findNewRate401k = (values: FindRateValues): number => {
	const newRate401k = plus(values.newRate401k)(INTERVAL_FIND_401K);
	const newFutureContribution401k = times(values.totalFutureIncomeFor401k)(
		newRate401k
	);
	const newValues: FindRateValues = {
		...values,
		newRate401k,
		newFutureContribution401k
	};
	if (isOver401kLimit(newValues)) {
		return minus(newRate401k)(INTERVAL_FIND_401K);
	}
	return findNewRate401k(newValues);
};

const getTotalGrossPayForBonuses = (bonuses: ReadonlyArray<Bonus>): number =>
	pipe(
		bonuses,
		RArray.map((bonus) => bonus.grossPay),
		Monoid.concatAll(decimalMonoidSum)
	);

const getTotalGrossPayForPaychecks = (
	paychecks: ReadonlyArray<Paycheck>
): number =>
	pipe(
		paychecks,
		RArray.map((paycheck) =>
			times(paycheck.grossPay)(paycheck.numberOfChecks)
		),
		Monoid.concatAll(decimalMonoidSum)
	);

const getTotalFutureIncome = (context: BaseContext): number => {
	const totalForPaychecks = getTotalGrossPayForPaychecks(
		context.personalData.futurePaychecks
	);
	const totalForBonuses = getTotalGrossPayForBonuses(
		context.personalData.futureBonuses
	);
	return plus(totalForPaychecks)(totalForBonuses);
};

export const calculateFuture401kRate = (
	context: BaseContext,
	pastContribution401k: Contribution401k
): TryT<number> => {
	const totalFutureIncomeFor401k = getTotalFutureIncome(context);
	return pipe(
		getTotalPastContribution(context, pastContribution401k),
		Either.map(
			(totalPastContribution401k): FindRateValues => ({
				totalPastContribution401k:
					totalPastContribution401k.employeeContribution,
				totalFutureIncomeFor401k,
				newRate401k: INTERVAL_FIND_401K,
				newFutureContribution401k: 0,
				contributionLimit401k: context.legalData.contributionLimit401k
			})
		),
		Either.map(findNewRate401k)
	);
};
