import { BasePaycheck, BenefitsCost, LegalData } from '../../data/decoders';
import { BenefitsCostAndTotal, PaycheckWithTotal } from './TotalTypes';
import { sumBenefits } from '../CommonCalculations';
import Decimal from 'decimal.js';
import { getAmount401k, getPayrollTaxCosts, getRate401k } from './common';

const addTotalToBenefits = (benefits: BenefitsCost): BenefitsCostAndTotal => ({
	...benefits,
	total: sumBenefits(benefits)
});

export const addTotalsToPaycheck =
	(legalData: LegalData) =>
	<T extends BasePaycheck>(paycheck: T): PaycheckWithTotal => {
		const benefitsCost = addTotalToBenefits(paycheck.benefitsCost);
		const payrollTaxCost = getPayrollTaxCosts(
			paycheck.grossPay,
			legalData.payrollTaxRates
		);

		const rate401k = getRate401k(paycheck);
		const amount401k = getAmount401k(paycheck.grossPay, rate401k);
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
			federalTaxCost: {
				effectiveRate: 0,
				amount: 0
			},
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
				),
				takeHomePay: 0
			},
			annualized: {
				taxablePay: annualizedTaxablePay,
				grossPay: annualizedGrossPay
			},
			payrollTaxCost
		};
	};

const annualizePayPeriodValue = (value: number): number =>
	new Decimal(value).times(new Decimal(26)).toNumber();
const totalValueForChecks = (value: number, numChecks: number): number =>
	new Decimal(value).times(new Decimal(numChecks)).toNumber();
