import { BenefitsCost } from '../data/decoders';

export interface PerPaycheckBenefitsCost extends BenefitsCost {
	readonly numberOfChecks: number;
}

export interface PerPaycheckIncome {
	readonly grossPay: number;
	readonly numberOfChecks: number;
}

export interface PastData {
	readonly totalIncome: number;
	readonly totalTaxableIncome: number;
	readonly totalBenefitsCost: number;
	readonly total401kContribution: number;
}
