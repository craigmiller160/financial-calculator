import { BaseBonus, BasePaycheck, BenefitsCost, Data } from '../data/decoders';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import * as Monoid from 'fp-ts/Monoid';
import * as Num from 'fp-ts/number';
import { PerPaycheckBenefitsCost } from './CalculationTypes';
import {
	totalBenefitsCostPerPaycheckMonoid,
	totalPaycheckIncomeMonoid
} from './CalculationMonoids';

const getTotalBenefitsCost = (
	paychecks: ReadonlyArray<BasePaycheck>
): BenefitsCost =>
	pipe(
		paychecks,
		RArray.map(
			(_): PerPaycheckBenefitsCost => ({
				..._.benefitsCost,
				numberOfChecks: _.numberOfChecks
			})
		),
		Monoid.concatAll(totalBenefitsCostPerPaycheckMonoid)
	);

const getTotalBonusIncome = (bonuses: ReadonlyArray<BaseBonus>): number =>
	pipe(
		bonuses,
		RArray.map((_) => _.grossPay),
		Monoid.concatAll(Num.MonoidSum)
	);

export const calculatePastData = (data: Data): unknown => {
	const totalBenefitsCost = getTotalBenefitsCost(data.pastPaychecks);
	const totalPaycheckIncome = Monoid.concatAll(totalPaycheckIncomeMonoid)(
		data.pastPaychecks
	);
	const totalBonusIncome = getTotalBonusIncome(data.pastBonuses);
	return totalBenefitsCost;
};
