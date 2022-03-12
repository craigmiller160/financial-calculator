import { PersonalDataWithTotals } from '../calculations/totals/TotalTypes';

const CURRENCY_FORMAT = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
});
const PERCENT_FORMAT = new Intl.NumberFormat('en-US', {
	style: 'percent',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});

const formatPercent = (num: number): string => PERCENT_FORMAT.format(num);
const formatCurrency = (num: number): string => CURRENCY_FORMAT.format(num);

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

export const formatOutput = (data: PersonalDataWithTotals): string => {
	const percent401k = formatPercent(data.futureRate401k);
	const rothIraLimit = formatCurrency(data.rothIraLimit);
	return `
	    New 401k Contribution Rate: ${percent401k}
	    This Year's Roth IRA Limit: ${rothIraLimit}  
	`;
};
