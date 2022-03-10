import {
	BasePaycheck,
	BenefitsCost,
	LegalData,
	PayrollTaxRates
} from '../../data/decoders';
import {
	BenefitsCostAndTotal,
	PaycheckWithTotal,
	PayrollTaxCosts
} from './TotalTypes';
import { sumBenefits } from '../CommonCalculations';
import Decimal from 'decimal.js';
import { match, when } from 'ts-pattern';
import { isPaycheckWith401k } from '../utils/typeCheck';

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

export const addTotalsToPaycheck =
	(legalData: LegalData) =>
	<T extends BasePaycheck>(paycheck: T): PaycheckWithTotal => {
		const benefitsCost = addTotalToBenefits(paycheck.benefitsCost);
		const payrollTaxCost = getPayrollTaxCosts(
			paycheck,
			legalData.payrollTaxRates
		);

		const [rate401k, amount401k] = getRateAndAmount401k(paycheck);
		const annualizedGrossPay = annualizePayPeriodValue(paycheck.grossPay);

		const taxablePay =
			paycheck.grossPay -
			benefitsCost.total -
			payrollTaxCost.total -
			amount401k;
		const annualizedTaxablePay = annualizePayPeriodValue(taxablePay);

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
				contribution401k: totalValueForChecks(
					amount401k,
					paycheck.numberOfChecks
				),
				benefitsCost: totalValueForChecks(
					benefitsCost.total,
					paycheck.numberOfChecks
				),
				grossPay: totalValueForChecks(
					paycheck.grossPay,
					paycheck.numberOfChecks
				),
				taxablePay: totalValueForChecks(
					taxablePay,
					paycheck.numberOfChecks
				)
			},
			annualized: {
				taxablePay: annualizedTaxablePay,
				grossPay: annualizedGrossPay
			},
			payrollTaxCost
		};
	};

const annualizePayPeriodValue = (value: number): number => value * 26;
const totalValueForChecks = (value: number, numChecks: number): number =>
	new Decimal(value).times(new Decimal(numChecks)).toNumber();
