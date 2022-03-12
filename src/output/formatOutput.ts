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

export const formatOutput = (data: PersonalDataWithTotals): string => {
	const percent401k = formatPercent(data.futureRate401k);
	const rothIraLimit = formatCurrency(data.rothIraLimit);
	return `
	    New 401k Contribution Rate: ${percent401k}
	    This Year's Roth IRA Limit: ${rothIraLimit}  
	`;
};
