import { BenefitsCost } from '../data/decoders';

export interface PerPaycheckBenefitsCost extends BenefitsCost {
	readonly numberOfChecks: number;
}
