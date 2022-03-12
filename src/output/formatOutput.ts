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

export const formatOutput = (data: PersonalDataWithTotals): string => {
	const percent401k = PERCENT_FORMAT.format(data.futureRate401k);
	const rothIraLimit = CURRENCY_FORMAT.format(data.rothIraLimit);
	return `
	    New 401k Contribution Rate: ${percent401k}
	    This Year's Roth IRA Limit: ${rothIraLimit}  
	`;
};
