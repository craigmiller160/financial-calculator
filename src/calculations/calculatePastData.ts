import { BonusWith401k, PaycheckWith401k, Data } from '../data/decoders';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import * as Monoid from 'fp-ts/Monoid';
import * as Num from 'fp-ts/number';
import { PastData } from './CalculationTypes';
import {
	getTotalBenefitsCost,
	getTotalBonusIncome,
	getTotalPaycheckIncome
} from './CommonCalculations';
import Decimal from 'decimal.js';

const getTotalPaycheck401k = (
	paychecks: ReadonlyArray<PaycheckWith401k>
): number =>
	pipe(
		paychecks,
		RArray.map((_) =>
			new Decimal(_.grossPay).times(new Decimal(_.rate401k))
		),
		RArray.map((_) => _.toNumber()),
		Monoid.concatAll(Num.MonoidSum)
	);

const getTotalBonus401k = (bonuses: ReadonlyArray<BonusWith401k>): number =>
	pipe(
		bonuses,
		RArray.map((_) =>
			new Decimal(_.grossPay).times(new Decimal(_.rate401k))
		),
		RArray.map((_) => _.toNumber()),
		Monoid.concatAll(Num.MonoidSum)
	);

export const calculatePastData = (data: Data): PastData => {
	const totalBenefitsCost = getTotalBenefitsCost(
		data.personalData.pastPaychecks
	);
	const totalPaycheckIncome = getTotalPaycheckIncome(
		data.personalData.pastPaychecks
	);
	const totalBonusIncome = getTotalBonusIncome(data.personalData.pastBonuses);
	const totalIncome = new Decimal(totalPaycheckIncome + totalBonusIncome);
	const totalPaycheck401k = getTotalPaycheck401k(
		data.personalData.pastPaychecks
	);
	const totalBonus401k = getTotalBonus401k(data.personalData.pastBonuses);
	const total401kContribution = new Decimal(
		totalPaycheck401k + totalBonus401k
	);
	const ssnCost = totalIncome.times(
		new Decimal(data.legalData.payrollTaxRates.socialSecurity)
	);
	const medicareCost = totalIncome.times(
		new Decimal(data.legalData.payrollTaxRates.medicare)
	);
	const totalTaxableIncome = totalIncome
		.minus(ssnCost)
		.minus(medicareCost)
		.minus(totalBenefitsCost)
		.minus(total401kContribution);
	return {
		totalTaxableIncome,
		total401kContribution
	};
};
