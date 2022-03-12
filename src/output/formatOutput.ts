import {
	PaycheckWithTotal,
	PersonalDataWithTotals
} from '../calculations/totals/TotalTypes';
import { MonoidT } from '@craigmiller160/ts-functions/types';
import * as Monoid from 'fp-ts/Monoid';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';

const newlineMonoid: MonoidT<string> = {
	empty: '',
	concat: (a, b) => {
		if (a.length === 0) {
			return b;
		}
		return `${a}\n${b}`;
	}
};

const CURRENCY_FORMAT = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
});
const PERCENT_FORMAT = new Intl.NumberFormat('en-US', {
	style: 'percent',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});
const COL_LENGTH = 15;

const formatPercent = (num: number): string => PERCENT_FORMAT.format(num);
const formatCurrency = (num: number): string => CURRENCY_FORMAT.format(num);
const pad = (text: string): string => ` ${text.padEnd(COL_LENGTH, ' ')}`;

const PAYCHECK_HEADER = `|${pad('Start')}|${pad('End')}|${pad(
	'Gross Pay'
)}|${pad('401k Rate')}|${pad('Take Home')}|`;

/*
 * 1) Paycheck Info
 * 		a) Date Range
 * 		b) Gross Pay
 * 		c) 401k Rate
 * 		d) Take Home Pay
 * 2) Bonuses
 * 		a) Date
 * 		b) Gross Pay
 * 		c) 401k Rate
 * 		d) Take Home Pay
 * 3) Totals
 * 		a) Gross Pay
 * 		b) AGI/MAGI
 * 		c) 401k Contribution
 * 		d) Take Home Pay
 * 4) New Stats
 * 		a) 401k
 * 		b) Roth IRA
 */

const formatPaycheck = (paycheck: PaycheckWithTotal): string => {
	const startDate = pad(paycheck.startDate);
	const endDate = pad(paycheck.endDate);
	const grossPay = pad(formatCurrency(paycheck.grossPay));
	const rate401k = pad(formatPercent(paycheck.paycheck401k.rate));
	const takeHome = pad(formatCurrency(paycheck.estimatedTakeHomePay));
	return `|${startDate}|${endDate}|${grossPay}|${rate401k}|${takeHome}|`;
};

const formatAllPaychecks = (
	paychecks: ReadonlyArray<PaycheckWithTotal>
): string =>
	pipe(
		paychecks,
		RArray.map(formatPaycheck),
		Monoid.concatAll(newlineMonoid)
	);

export const formatOutput = (data: PersonalDataWithTotals): string => {
	const percent401k = formatPercent(data.futureRate401k);
	const rothIraLimit = formatCurrency(data.rothIraLimit);
	return `
		PAYCHECKS
			${PAYCHECK_HEADER}
			${formatAllPaychecks(data.pastPaychecks)}
			${formatAllPaychecks(data.futurePaychecks)}
			
	    New 401k Contribution Rate: ${percent401k}
	    This Year's Roth IRA Limit: ${rothIraLimit}  
	`;
};
