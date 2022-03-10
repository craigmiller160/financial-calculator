import {
	BasePaycheck,
	BenefitsCost,
	PayrollTaxRates
} from '../../data/decoders';
import { sumBenefits } from '../CommonCalculations';
import Decimal from 'decimal.js';

export interface BenefitsCostAndTotal extends BenefitsCost {
	readonly total: number;
}

export interface PayrollTaxCosts {
	readonly socialSecurity: number;
	readonly medicare: number;
	readonly total: number;
}

const addTotalToBenefits = (benefits: BenefitsCost): BenefitsCostAndTotal => ({
	...benefits,
	total: sumBenefits(benefits)
});

const getPayrollTaxCosts = (
	paycheck: BasePaycheck,
	payrollTaxRates: PayrollTaxRates
): PayrollTaxCosts => {
	const grossPay = new Decimal(paycheck.grossPay);
	const socialSecurity = grossPay.times(
		new Decimal(payrollTaxRates.socialSecurity)
	);
	const medicare = grossPay.times(new Decimal(payrollTaxRates.medicare));
	const total = socialSecurity.plus(medicare);
	return {
		socialSecurity: socialSecurity.toNumber(),
		medicare: medicare.toNumber(),
		total: total.toNumber()
	};
};

export const addTotalsToData = () => {};
