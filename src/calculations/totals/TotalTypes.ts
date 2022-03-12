import { BenefitsCost, LegalData } from '../../data/decoders';

export interface BenefitsCostAndTotal extends BenefitsCost {
	readonly total: number;
}

export interface BonusWithTotal {
	readonly date: string;
	readonly grossPay: number;
	readonly bonus401k: The401k;
	readonly payrollTaxCosts: PayrollTaxCosts;
	readonly federalTaxCosts: FederalTaxCosts;
	readonly estimatedAGI: number;
	readonly estimatedMAGI: number;
	readonly estimatedTakeHomePay: number;
}

export interface The401k {
	readonly rate: number;
	readonly amount: number;
}

export interface Annualized {
	readonly grossPay: number;
	readonly estimatedAGI: number;
	readonly estimatedMAGI: number;
}

export interface PaycheckTotals {
	readonly grossPay: number;
	readonly benefitsCost: number;
	readonly contribution401k: number;
	readonly estimatedAGI: number;
	readonly estimatedMAGI: number;
	readonly estimatedTakeHomePay: number;
}

export interface FederalTaxCosts {
	readonly effectiveRate: number;
	readonly amount: number;
}

export interface PaycheckWithTotal {
	readonly startDate: string;
	readonly endDate: string;
	readonly benefitsCost: BenefitsCostAndTotal;
	readonly paycheck401k: The401k;
	readonly grossPay: number;
	readonly numberOfChecks: number;
	readonly estimatedAGI: number;
	readonly estimatedMAGI: number;
	readonly estimatedTakeHomePay: number;
	readonly payrollTaxCost: PayrollTaxCosts;
	readonly totalsForAllChecks: PaycheckTotals;
	readonly federalTaxCost: FederalTaxCosts;
	readonly annualized: Annualized;
}

export interface PayrollTaxCosts {
	readonly socialSecurity: number;
	readonly medicare: number;
	readonly total: number;
}

// TODO have sub-objects here for organization
export interface PersonalTotals {
	readonly pastGrossPay: number;
	readonly pastContribution401k: number;
	readonly pastEstimatedAGI: number;
	readonly pastEstimatedMAGI: number;
	readonly pastEstimatedTakeHomePay: number;
	readonly futureGrossPay: number;
	readonly futureContribution401k: number;
	readonly futureEstimatedAGI: number;
	readonly futureEstimatedMAGI: number;
	readonly futureEstimatedTakeHomePay: number;
}

export interface PersonalDataWithTotals {
	readonly pastPaychecks: ReadonlyArray<PaycheckWithTotal>;
	readonly futurePaychecks: ReadonlyArray<PaycheckWithTotal>;
	readonly pastBonuses: ReadonlyArray<BonusWithTotal>;
	readonly futureBonuses: ReadonlyArray<BonusWithTotal>;
	readonly totals: PersonalTotals;
	readonly futureRate401k: number;
}

export interface CombinedTotals {
	readonly grossPay: number;
	readonly contribution401k: number;
	readonly estimatedAGI: number;
	readonly estimatedMAGI: number;
	readonly estimatedTakeHomePay: number;
}

export interface DataWithTotals {
	readonly personalData: PersonalDataWithTotals;
	readonly legalData: LegalData;
}
