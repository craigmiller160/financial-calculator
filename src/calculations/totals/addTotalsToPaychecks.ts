import { BasePaycheck, BenefitsCost, LegalData } from '../../data/decoders';
import { BenefitsCostAndTotal, PaycheckWithTotal } from './TotalTypes';
import { getAmount401k, getPayrollTaxCosts, getRate401k } from './common';
import { annualizePayPeriodValue } from '../utils/annualizePayPeriodValue';
import { totalValueForChecks } from '../utils/totalValueForChecks';

export const sumBenefits = (benefits: BenefitsCost): number =>
	benefits.dental +
	benefits.hsa +
	benefits.medical +
	benefits.vision +
	benefits.fsa;

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
			estimatedAGI: 0,
			estimatedMAGI: 0,
			estimatedTakeHomePay: 0,
			federalTaxCost: {
				effectiveRate: 0,
				amount: 0
			},
			totalsForAllChecks: {
				contribution401k: totalValueForChecks(
					amount401k,
					paycheck.numberOfChecks
				),
				contributionHsa: totalValueForChecks(
					paycheck.benefitsCost.hsa,
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
				estimatedAGI: 0,
				estimatedMAGI: 0,
				estimatedTakeHomePay: 0
			},
			annualized: {
				estimatedAGI: 0,
				estimatedMAGI: 0,
				grossPay: annualizedGrossPay
			},
			payrollTaxCost
		};
	};
