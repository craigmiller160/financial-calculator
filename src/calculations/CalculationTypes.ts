import { BenefitsCost } from '../data/decoders';

export interface PerPaycheckBenefitsCost extends BenefitsCost {
	readonly numberOfChecks: number;
}

export interface PerPaycheckIncome {
	readonly grossPay: number;
	readonly numberOfChecks: number;
}
