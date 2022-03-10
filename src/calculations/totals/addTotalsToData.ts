import {
	BasePaycheck,
	BenefitsCost,
	Data,
	LegalData,
	PaycheckWith401k,
	PayrollTaxRates,
	Rate401k
} from '../../data/decoders';
import { sumBenefits } from '../CommonCalculations';
import Decimal from 'decimal.js';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import { match, when } from 'ts-pattern';
import { hasRate401k } from '../utils/typeCheck';
import { unknown } from 'io-ts';

export interface BenefitsCostAndTotal extends BenefitsCost {
	readonly total: number;
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

const isPaycheckWith401k = (
	paycheck: BasePaycheck
): paycheck is PaycheckWith401k => (paycheck as any).rate401k !== undefined;

const addTotalsToPaycheck =
	(legalData: LegalData) =>
	<T extends BasePaycheck>(paycheck: T): T => {
		const benefitsCost = addTotalToBenefits(paycheck.benefitsCost);
		const payrollTaxCost = getPayrollTaxCosts(
			paycheck,
			legalData.payrollTaxRates
		);

		const rate401k = match(paycheck as BasePaycheck)
			.with(when(isPaycheckWith401k), (value) => value.rate401k)
			.otherwise(() => 0);
		const amount401k = new Decimal(paycheck.grossPay).times(
			new Decimal(rate401k)
		);
	};

export const addTotalsToData = (data: Data) => {
	pipe(
		data.personalData.pastPaychecks,
		RArray.map(addTotalsToPaycheck(data.legalData))
	);
};
