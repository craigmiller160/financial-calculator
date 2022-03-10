import { match, when } from 'ts-pattern';
import { hasRate401k } from '../utils/typeCheck';
import Decimal from 'decimal.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRate401k = (value: any): number =>
	match(value)
		.with(when(hasRate401k), (_) => _.rate401k)
		.otherwise(() => 0);

export const getAmount401k = (grossPay: number, rate401k: number): number =>
	new Decimal(grossPay).times(new Decimal(rate401k)).toNumber();
