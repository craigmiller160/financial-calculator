import { BaseBonus, BasePaycheck, BenefitsCost } from '../data/decoders';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import { PerPaycheckBenefitsCost } from './CalculationTypes';
import * as Monoid from 'fp-ts/Monoid';
import {
	totalBenefitsCostPerPaycheckMonoid,
	totalPaycheckIncomeMonoid
} from './CalculationMonoids';
import * as Num from 'fp-ts/number';

// TODO write tests for these, or deleete if not used

export const sumBenefits = (benefits: BenefitsCost): number =>
	benefits.dental + benefits.hsa + benefits.medical + benefits.vision;

export const getTotalBenefitsCost = (
	paychecks: ReadonlyArray<BasePaycheck>
): number =>
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

export const getTotalBonusIncome = (
	bonuses: ReadonlyArray<BaseBonus>
): number =>
	pipe(
		bonuses,
		RArray.map((_) => _.grossPay),
		Monoid.concatAll(Num.MonoidSum)
	);

export const getTotalPaycheckIncome = (
	paychecks: ReadonlyArray<BasePaycheck>
): number =>
	pipe(paychecks, Monoid.concatAll(totalPaycheckIncomeMonoid)).grossPay;
