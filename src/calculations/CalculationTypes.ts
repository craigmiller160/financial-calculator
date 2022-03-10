import { BenefitsCost, PaycheckWith401k } from '../data/decoders';
import Decimal from 'decimal.js';

export interface PerPaycheckBenefitsCost extends BenefitsCost {
	readonly numberOfChecks: number;
}

export interface PerPaycheckIncome {
	readonly grossPay: number;
	readonly numberOfChecks: number;
}

export interface PastData {
	readonly totalTaxableIncome: Decimal;
	readonly total401kContribution: Decimal;
}

export interface FutureData {
	readonly totalIncome: Decimal;
	readonly payrollTaxesCost: Decimal;
	readonly totalBenefitsCost: Decimal;
}

export interface Calculations401k {
	readonly pastData: PastData;
	readonly futureData: FutureData;
	readonly future401kRate: Decimal;
}

export interface PaycheckWithTakeHome extends PaycheckWith401k{
	readonly taxableIncome: number;
	readonly contribution401k: number;
	readonly effectiveFederalTaxRate: number;
	readonly federalTaxes: number;
	readonly totalBenefitsCost: number;
	readonly payrollTaxes: number;
	readonly takeHomePay: number;
}
