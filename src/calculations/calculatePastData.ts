import { PastBonus, PastPaycheck, Data } from '../data/decoders';
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
	const totalBenefitsCost = getTotalBenefitsCost(
		data.personalData.pastPaychecks
	);
	const totalPaycheckIncome = getTotalPaycheckIncome(
		data.personalData.pastPaychecks
	);
	const totalBonusIncome = getTotalBonusIncome(data.personalData.pastBonuses);
	const totalIncome = totalPaycheckIncome + totalBonusIncome;
	const totalPaycheck401k = getTotalPaycheck401k(
		data.personalData.pastPaychecks
	);
	const totalBonus401k = getTotalBonus401k(data.personalData.pastBonuses);
	const total401kContribution = totalPaycheck401k + totalBonus401k;
	const ssnCost = totalIncome * data.legalData.payrollTaxRates.socialSecurity;
	const medicareCost = totalIncome * data.legalData.payrollTaxRates.medicare;
	const totalTaxableIncome =
		totalIncome -
		ssnCost -
		medicareCost -
		totalBenefitsCost -
		total401kContribution;
	return {
		totalTaxableIncome,
		total401kContribution
	};
};
