import Decimal from 'decimal.js';

// TODO write test
export const annualizePayPeriodValue = (value: number): number =>
	new Decimal(value).times(new Decimal(26)).toNumber();
