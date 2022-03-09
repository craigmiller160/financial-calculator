import { PersonalData } from '../data/decoders';
import {
	getTotalBenefitsCost,
	getTotalBonusIncome,
	getTotalPaycheckIncome
} from './CommonCalculations';
import { FutureData } from './CalculationTypes';

export const calculateFutureData = (data: PersonalData): FutureData => {
	const totalBenefitsCost = getTotalBenefitsCost(data.futurePaychecks);
	const totalPaycheckIncome = getTotalPaycheckIncome(data.futurePaychecks);
	const totalBonusIncome = getTotalBonusIncome(data.futureBonuses);
	const totalIncome = totalPaycheckIncome + totalBonusIncome;
	const ssnCost = totalIncome * data.staticTaxRates.socialSecurity;
	const medicareCost = totalIncome * data.staticTaxRates.medicare;
	const staticTaxesCost = ssnCost + medicareCost;
	return {
		totalIncome,
		totalBenefitsCost,
		staticTaxesCost
	};
};
