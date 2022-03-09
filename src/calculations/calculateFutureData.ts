import { Data } from '../data/decoders';
import {
	getTotalBenefitsCost,
	getTotalBonusIncome,
	getTotalPaycheckIncome
} from './CommonCalculations';
import { FutureData } from './CalculationTypes';

export const calculateFutureData = (data: Data): FutureData => {
	const totalBenefitsCost = getTotalBenefitsCost(
		data.personalData.futurePaychecks
	);
	const totalPaycheckIncome = getTotalPaycheckIncome(
		data.personalData.futurePaychecks
	);
	const totalBonusIncome = getTotalBonusIncome(
		data.personalData.futureBonuses
	);
	const totalIncome = totalPaycheckIncome + totalBonusIncome;
	const ssnCost = totalIncome * data.legalData.payrollTaxRates.socialSecurity;
	const medicareCost = totalIncome * data.legalData.payrollTaxRates.medicare;
	const staticTaxesCost = ssnCost + medicareCost;
	return {
		totalIncome,
		totalBenefitsCost,
		staticTaxesCost
	};
};
