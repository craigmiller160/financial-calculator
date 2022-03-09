import { BenefitsCost } from '../data/decoders';

export interface PerPaycheckBenefitsCost extends BenefitsCost {
	readonly numberOfChecks: number;
}

export interface PerPaycheckIncome {
	readonly grossPay: number;
	readonly numberOfChecks: number;
}

export interface PastData {
	readonly totalTaxableIncome: number;
	readonly total401kContribution: number;
}

export interface FutureData {
	readonly totalIncome: number;
	readonly staticTaxesCost: number;
	readonly totalBenefitsCost: number;
}
