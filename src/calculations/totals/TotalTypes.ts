import { BenefitsCost } from '../../data/decoders';

export interface BenefitsCostAndTotal extends BenefitsCost {
	readonly total: number;
}

export interface The401k {
	readonly rate: number;
	readonly amount: number;
}

export interface Annualized {
	readonly grossPay: number;
	readonly taxablePay: number;
}

export interface PaycheckTotals {
	readonly grossPay: number;
	readonly benefitsCost: number;
	readonly contribution401k: number;
	readonly taxablePay: number;
}

export interface PaycheckWithTotal {
	readonly startDate: string;
	readonly endDate: string;
	readonly benefitsCost: BenefitsCostAndTotal;
	readonly paycheck401k: The401k;
	readonly grossPay: number;
	readonly numberOfChecks: number;
	readonly taxablePay: number;
	readonly payrollTaxCost: PayrollTaxCosts;
	readonly totalsForAllChecks: PaycheckTotals;
	readonly annualized: Annualized;
}

export interface PayrollTaxCosts {
	readonly socialSecurity: number;
	readonly medicare: number;
	readonly total: number;
}
