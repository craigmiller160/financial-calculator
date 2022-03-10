import {
	BasePaycheck,
	BenefitsCost,
	Data,
	LegalData,
	PayrollTaxRates
} from '../../data/decoders';
import { sumBenefits } from '../CommonCalculations';
import Decimal from 'decimal.js';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import { match, when } from 'ts-pattern';
import { isPaycheckWith401k } from '../utils/typeCheck';

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

const getRateAndAmount401k = <T extends BasePaycheck>(
	paycheck: T
): [rate: number, amount: number] => {
	const rate401k = match(paycheck as BasePaycheck)
		.with(when(isPaycheckWith401k), (value) => value.rate401k)
		.otherwise(() => 0);
	const amount401k = new Decimal(paycheck.grossPay).times(
		new Decimal(rate401k)
	);
	return [rate401k, amount401k.toNumber()];
};

const addTotalsToPaycheck =
	(legalData: LegalData) =>
	<T extends BasePaycheck>(paycheck: T): PaycheckWithTotal => {
		const benefitsCost = addTotalToBenefits(paycheck.benefitsCost);
		const payrollTaxCost = getPayrollTaxCosts(
			paycheck,
			legalData.payrollTaxRates
		);

		const [rate401k, amount401k] = getRateAndAmount401k(paycheck);
		const totalAnnualizedPay = getTotalAnnualizedPay(paycheck);

		const taxablePay =
			paycheck.grossPay -
			benefitsCost.total -
			payrollTaxCost.total -
			amount401k;

		return {
			startDate: paycheck.startDate,
			endDate: paycheck.endDate,
			benefitsCost,
			numberOfChecks: paycheck.numberOfChecks,
			grossPay: paycheck.grossPay,
			paycheck401k: {
				rate: rate401k,
				amount: amount401k
			},
			taxablePay,
			totalsForAllChecks: {
				contribution401k: 0,
				benefitsCost: 0,
				grossPay: 0
			},
			annualized: {
				taxablePay: 0,
				grossPay: 0
			},
			payrollTaxCost
		};
	};

const getTotalAnnualizedPay = (paycheck: BasePaycheck): number =>
	paycheck.grossPay * 26;

export const addTotalsToData = (data: Data) => {
	pipe(
		data.personalData.pastPaychecks,
		RArray.map(addTotalsToPaycheck(data.legalData))
	);

	pipe(
		data.personalData.futurePaychecks,
		RArray.map(addTotalsToPaycheck(data.legalData))
	);
};
