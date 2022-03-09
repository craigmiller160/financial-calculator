import { Data } from '../data/decoders';
import {
	getTotalBenefitsCost,
	getTotalBonusIncome,
	getTotalPaycheckIncome
} from './CommonCalculations';
import { FutureData } from './CalculationTypes';
import Decimal from 'decimal.js';

export const calculateFutureData = (data: Data): FutureData => {
	const totalBenefitsCost = new Decimal(
		getTotalBenefitsCost(data.personalData.futurePaychecks)
	);
	const totalPaycheckIncome = getTotalPaycheckIncome(
		data.personalData.futurePaychecks
	);
	const totalBonusIncome = getTotalBonusIncome(
		data.personalData.futureBonuses
	);
	const totalIncome = new Decimal(totalPaycheckIncome + totalBonusIncome);
	const ssnCost = totalIncome.times(
		new Decimal(data.legalData.payrollTaxRates.socialSecurity)
	);
	const medicareCost = totalIncome.times(
		new Decimal(data.legalData.payrollTaxRates.medicare)
	);
	const staticTaxesCost = ssnCost.plus(medicareCost);
	return {
		totalIncome,
		totalBenefitsCost,
		staticTaxesCost
	};
};
