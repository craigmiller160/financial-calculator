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
	readonly taxablePay: number; // TODO update this with fed
	readonly takeHomePay: number; // TODO update with fed
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
	readonly taxablePay: number; // TODO update this with fed
	readonly takeHomePay: number; // TODO update with fed
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
	readonly taxablePay: number;
	readonly takeHomePay: number; // TODO update with fed
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

export interface PersonalTotals {
	readonly pastGrossPay: number;
	readonly pastContribution401k: number;
	readonly pastTaxablePay: number; // TODO update with fed
	readonly pastTakeHomePay: number; // TODO update with fed
	readonly futureGrossPay: number;
	readonly futureContribution401k: number;
	readonly futureTaxablePay: number; // TODO update with fed
	readonly futureTakeHomePay: number; // TODO update with fed
}

export interface TotalPersonalData {
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
	readonly taxablePay: number;
}

export interface DataWithTotals {
	readonly personalData: TotalPersonalData;
	readonly legalData: LegalData;
}
