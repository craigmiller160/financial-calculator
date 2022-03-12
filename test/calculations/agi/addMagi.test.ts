import { PersonalDataWithTotals } from '../../../src/calculations/totals/TotalTypes';
import { addMagi } from '../../../src/calculations/agi/addMagi';
import produce from 'immer';

const data: PersonalDataWithTotals = {
	futureBonuses: [
		{
			date: '2022-08-01',
			grossPay: 5000,
			bonus401k: {
				amount: 0,
				rate: 0
			},
			payrollTaxCosts: {
				medicare: 72.5,
				socialSecurity: 310,
				total: 382.5
			},
			estimatedAGI: 4617.5,
			estimatedMAGI: 0,
			federalTaxCosts: {
				effectiveRate: 0,
				amount: 0
			},
			estimatedTakeHomePay: 0
		}
	],
	futurePaychecks: [
		{
			startDate: '2022-03-14',
			endDate: '2022-12-31',
			estimatedTakeHomePay: 0,
			benefitsCost: {
				dental: 10,
				hsa: 38.46,
				medical: 0,
				total: 58.46,
				vision: 10
			},
			federalTaxCost: {
				effectiveRate: 0,
				amount: 0
			},
			grossPay: 5769.23,
			annualized: {
				grossPay: 149999.98,
				estimatedAGI: 137005.02153,
				estimatedMAGI: 0
			},
			numberOfChecks: 21,
			paycheck401k: {
				amount: 0,
				rate: 0
			},
			payrollTaxCost: {
				medicare: 83.653835,
				socialSecurity: 357.69226,
				total: 441.346095
			},
			estimatedAGI: 5269.423905,
			estimatedMAGI: 0,
			totalsForAllChecks: {
				benefitsCost: 1227.66,
				contribution401k: 0,
				grossPay: 121153.83,
				estimatedAGI: 110657.902005,
				estimatedMAGI: 0,
				estimatedTakeHomePay: 0
			}
		}
	],
	pastBonuses: [
		{
			bonus401k: {
				amount: 3168.48,
				rate: 0.21
			},
			date: '2022-03-11',
			grossPay: 15088,
			payrollTaxCosts: {
				medicare: 218.776,
				socialSecurity: 935.456,
				total: 1154.232
			},
			estimatedAGI: 10765.288,
			estimatedMAGI: 0,
			federalTaxCosts: {
				amount: 0,
				effectiveRate: 0
			},
			estimatedTakeHomePay: 0
		}
	],
	pastPaychecks: [
		{
			startDate: '2022-01-01',
			endDate: '2022-03-11',
			estimatedTakeHomePay: 0,
			annualized: {
				grossPay: 96835.18,
				estimatedAGI: 66061.08093,
				estimatedMAGI: 0
			},
			benefitsCost: {
				dental: 5.84,
				hsa: 38.46,
				medical: 68.92,
				total: 116.57,
				vision: 3.35
			},
			federalTaxCost: {
				amount: 0,
				effectiveRate: 0
			},
			grossPay: 3724.43,
			numberOfChecks: 5,
			paycheck401k: {
				amount: 782.1303,
				rate: 0.21
			},
			payrollTaxCost: {
				medicare: 54.004235,
				socialSecurity: 230.91466,
				total: 284.918895
			},
			estimatedAGI: 2540.810805,
			estimatedMAGI: 0,
			totalsForAllChecks: {
				benefitsCost: 582.85,
				contribution401k: 3910.6515,
				grossPay: 18622.15,
				estimatedAGI: 12704.054025,
				estimatedMAGI: 0,
				estimatedTakeHomePay: 0
			}
		}
	],
	totals: {
		past: {
			grossPay: 0,
			contribution401k: 0,
			estimatedAGI: 0,
			estimatedMAGI: 0,
			estimatedTakeHomePay: 0
		},
		future: {
			grossPay: 0,
			contribution401k: 0,
			estimatedAGI: 0,
			estimatedMAGI: 0,
			estimatedTakeHomePay: 0
		},
		combined: {
			grossPay: 0,
			contribution401k: 0,
			estimatedAGI: 0,
			estimatedMAGI: 0,
			estimatedTakeHomePay: 0
		}
	},
	futureRate401k: 0,
	rothIraLimit: 0,
	additionalIncome: {
		taxableInvestmentIncome: 0
	}
};

describe('addMagi', () => {
	it('test', () => {
		const result = addMagi(data);
		const expectedResult = produce(data, (draft) => {
			draft.futureBonuses[0].estimatedMAGI = 4617.5;
			draft.futurePaychecks[0].annualized.estimatedMAGI = 137005.02153;
			draft.futurePaychecks[0].estimatedMAGI = 5269.423905;
			draft.futurePaychecks[0].totalsForAllChecks.estimatedMAGI = 110657.902005;
			draft.pastBonuses[0].estimatedMAGI = 10765.288;
			draft.pastPaychecks[0].annualized.estimatedMAGI = 66061.08093;
			draft.pastPaychecks[0].estimatedMAGI = 2540.810805;
			draft.pastPaychecks[0].totalsForAllChecks.estimatedMAGI = 12704.054025;
		});
		expect(result).toEqual(expectedResult);
	});
});
