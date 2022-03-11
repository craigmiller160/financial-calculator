import {
	BonusWithTotal,
	PaycheckWithTotal
} from '../../../src/calculations/totals/TotalTypes';
import {
	getCombinedTotalsForBonuses,
	getCombinedTotalsForPaychecks
} from '../../../src/calculations/combinedTotals/getCombinedTotals';

const pastPaycheck: PaycheckWithTotal = {
	startDate: '2022-01-01',
	endDate: '2022-03-11',
	benefitsCost: {
		dental: 5.84,
		hsa: 38.46,
		medical: 68.92,
		vision: 3.35,
		total: 116.57
	},
	takeHomePay: 0,
	numberOfChecks: 5,
	grossPay: 3724.43,
	paycheck401k: {
		rate: 0.21,
		amount: 782.1303
	},
	estimatedAGI: 2540.810805,
	federalTaxCost: {
		effectiveRate: 0,
		amount: 0
	},
	totalsForAllChecks: {
		contribution401k: 3910.6515,
		benefitsCost: 582.85,
		grossPay: 18622.15,
		estimatedAGI: 12704.054025,
		takeHomePay: 0
	},
	payrollTaxCost: {
		socialSecurity: 230.91466,
		medicare: 54.004235,
		total: 284.918895
	},
	annualized: {
		estimatedAGI: 66061.08093,
		grossPay: 96835.18
	}
};
const pastPaychecks = [pastPaycheck, pastPaycheck];

const futurePaycheck: PaycheckWithTotal = {
	startDate: '2022-03-14',
	endDate: '2022-12-31',
	takeHomePay: 0,
	benefitsCost: {
		dental: 10,
		hsa: 38.46,
		medical: 0,
		vision: 10,
		total: 58.46
	},
	numberOfChecks: 21,
	grossPay: 5769.23,
	paycheck401k: {
		rate: 0,
		amount: 0
	},
	federalTaxCost: {
		effectiveRate: 0,
		amount: 0
	},
	estimatedAGI: 5269.423905,
	totalsForAllChecks: {
		contribution401k: 0,
		benefitsCost: 1227.66,
		grossPay: 121153.83,
		estimatedAGI: 110657.902005,
		takeHomePay: 0
	},
	payrollTaxCost: {
		socialSecurity: 357.69226,
		medicare: 83.653835,
		total: 441.346095
	},
	annualized: {
		estimatedAGI: 137005.02153,
		grossPay: 149999.98
	}
};
const futurePaychecks = [futurePaycheck, futurePaycheck];

const pastBonus: BonusWithTotal = {
	date: '2022-03-11',
	grossPay: 15088,
	estimatedAGI: 10765.288,
	bonus401k: {
		rate: 0.21,
		amount: 3168.48
	},
	payrollTaxCosts: {
		socialSecurity: 935.456,
		medicare: 218.776,
		total: 1154.232
	},
	takeHomePay: 0,
	federalTaxCosts: {
		effectiveRate: 0,
		amount: 0
	}
};
const pastBonuses = [pastBonus, pastBonus];

const futureBonus: BonusWithTotal = {
	date: '2022-08-01',
	grossPay: 5000,
	estimatedAGI: 4617.5,
	bonus401k: {
		rate: 0,
		amount: 0
	},
	federalTaxCosts: {
		effectiveRate: 0,
		amount: 0
	},
	payrollTaxCosts: {
		socialSecurity: 310,
		medicare: 72.5,
		total: 382.5
	},
	takeHomePay: 0
};
const futureBonuses = [futureBonus, futureBonus];

describe('getCombinedTotals', () => {
	it('gets totals for past paychecks', () => {
		const result = getCombinedTotalsForPaychecks(pastPaychecks);
		expect(result).toEqual({
			grossPay: 37244.3,
			contribution401k: 7821.303,
			estimatedAGI: 25408.10805
		});
	});

	it('gets totals for future paychecks', () => {
		const result = getCombinedTotalsForPaychecks(futurePaychecks);
		expect(result).toEqual({
			grossPay: 242307.66,
			contribution401k: 0,
			estimatedAGI: 221315.80401
		});
	});

	it('gets totals for past bonuses', () => {
		const result = getCombinedTotalsForBonuses(pastBonuses);
		expect(result).toEqual({
			grossPay: 30176,
			contribution401k: 6336.96,
			estimatedAGI: 21530.576
		});
	});

	it('gets totals for future bonuses', () => {
		const result = getCombinedTotalsForBonuses(futureBonuses);
		expect(result).toEqual({
			grossPay: 10000,
			contribution401k: 0,
			estimatedAGI: 9235
		});
	});
});
