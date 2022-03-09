import {
	BaseBonus,
	BasePaycheck,
	BenefitsCost,
	Data,
	PastBonus,
	PastPaycheck
} from '../data/decoders';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import * as Monoid from 'fp-ts/Monoid';
import * as Num from 'fp-ts/number';
import { PastData, PerPaycheckBenefitsCost } from './CalculationTypes';
import {
	totalBenefitsCostPerPaycheckMonoid,
	totalPaycheckIncomeMonoid
} from './CalculationMonoids';

const sumBenefits = (benefits: BenefitsCost): number =>
	benefits.dental + benefits.hsa + benefits.medical + benefits.vision;

const getTotalBenefitsCost = (paychecks: ReadonlyArray<BasePaycheck>): number =>
	pipe(
		paychecks,
		RArray.map(
			(_): PerPaycheckBenefitsCost => ({
				..._.benefitsCost,
				numberOfChecks: _.numberOfChecks
			})
		),
		Monoid.concatAll(totalBenefitsCostPerPaycheckMonoid),
		sumBenefits
	);

const getTotalBonusIncome = (bonuses: ReadonlyArray<BaseBonus>): number =>
	pipe(
		bonuses,
		RArray.map((_) => _.grossPay),
		Monoid.concatAll(Num.MonoidSum)
	);

const getTotalPaycheckIncome = (
	paychecks: ReadonlyArray<BasePaycheck>
): number =>
	pipe(paychecks, Monoid.concatAll(totalPaycheckIncomeMonoid)).grossPay;

const getTotalPaycheck401k = (paychecks: ReadonlyArray<PastPaycheck>): number =>
	pipe(
		paychecks,
		RArray.map((_) => _.grossPay * _.rate401k),
		Monoid.concatAll(Num.MonoidSum)
	);

const getTotalBonus401k = (bonuses: ReadonlyArray<PastBonus>): number =>
	pipe(
		bonuses,
		RArray.map((_) => _.grossPay * _.rate401k),
		Monoid.concatAll(Num.MonoidSum)
	);

export const calculatePastData = (data: Data): PastData => {
	const totalBenefitsCost = getTotalBenefitsCost(data.pastPaychecks);
	const totalPaycheckIncome = getTotalPaycheckIncome(data.pastPaychecks);
	const totalBonusIncome = getTotalBonusIncome(data.pastBonuses);
	const totalIncome = totalPaycheckIncome + totalBonusIncome;
	const totalPaycheck401k = getTotalPaycheck401k(data.pastPaychecks);
	const totalBonus401k = getTotalBonus401k(data.pastBonuses);
	const total401kContribution = totalPaycheck401k + totalBonus401k;
	const ssnCost = totalIncome * data.staticTaxRates.socialSecurity;
	const medicareCost = totalIncome * data.staticTaxRates.medicare;
	const totalTaxableIncome =
		totalIncome -
		ssnCost -
		medicareCost -
		totalBenefitsCost -
		total401kContribution;
	return {
		totalIncome,
		totalTaxableIncome,
		totalBenefitsCost,
		total401kContribution
	};
};
