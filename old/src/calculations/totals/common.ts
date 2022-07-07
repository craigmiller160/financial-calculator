import { match, when } from 'ts-pattern';
import { hasRate401k } from '../utils/typeCheck';
import Decimal from 'decimal.js';
import { PayrollTaxRates } from '../../data/decoders';
import { PayrollTaxCosts } from './TotalTypes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRate401k = (value: any): number =>
	match(value)
		.with(when(hasRate401k), (_) => _.rate401k)
		.otherwise(() => 0);

export const getAmount401k = (grossPay: number, rate401k: number): number =>
	new Decimal(grossPay).times(new Decimal(rate401k)).toNumber();

export const getPayrollTaxCosts = (
	grossPay: number,
	payrollTaxRates: PayrollTaxRates
): PayrollTaxCosts => {
	const grossPayValue = new Decimal(grossPay);
	const socialSecurity = grossPayValue.times(
		new Decimal(payrollTaxRates.socialSecurity)
	);
	const medicare = grossPayValue.times(new Decimal(payrollTaxRates.medicare));
	const total = socialSecurity.plus(medicare);
	return {
		socialSecurity: socialSecurity.toNumber(),
		medicare: medicare.toNumber(),
		total: total.toNumber()
	};
};
