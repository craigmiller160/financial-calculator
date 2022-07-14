import Decimal from 'decimal.js';

export const times =
	(num1: number) =>
	(num2: number): number =>
		new Decimal(num1).times(new Decimal(num2)).toNumber();