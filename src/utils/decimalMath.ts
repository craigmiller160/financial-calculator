import Decimal from 'decimal.js';
import { MonoidT } from '@craigmiller160/ts-functions/types';

export const times =
	(num1: number) =>
	(num2: number): number =>
		new Decimal(num1).times(new Decimal(num2)).toNumber();

export const div =
	(num1: number) =>
	(num2: number): number =>
		new Decimal(num1).div(num2).toNumber();

export const plus =
	(num1: number) =>
	(num2: number): number =>
		new Decimal(num1).plus(new Decimal(num2)).toNumber();

export const minus =
	(num1: number) =>
	(num2: number): number =>
		new Decimal(num1).minus(new Decimal(num2)).toNumber();

export const decimalMonoidSum: MonoidT<number> = {
	empty: 0,
	concat: (a, b) => plus(a)(b)
};
