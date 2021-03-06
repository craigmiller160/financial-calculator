import { pipe } from 'fp-ts/function';
import { getTestData } from '../../testutils/TestData';
import * as IOEither from 'fp-ts/IOEither';
import {
	DataWithTotals,
	PersonalDataWithTotals
} from '../../../src/calculations/totals/TotalTypes';
import { addFuture401k } from '../../../src/calculations/401k/addFuture401k';
import '@relmify/jest-fp-ts';

const personalData: PersonalDataWithTotals = {
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
			estimatedAGI: 0,
			estimatedMAGI: 0,
			estimatedTakeHomePay: 0,
			federalTaxCosts: {
				effectiveRate: 0,
				amount: 0
			}
		}
	],
	futurePaychecks: [
		{
			startDate: '2022-03-14',
			endDate: '2022-12-31',
			estimatedTakeHomePay: 0,
			federalTaxCost: {
				effectiveRate: 0,
				amount: 0
			},
			benefitsCost: {
				dental: 10,
				hsa: 38.46,
				fsa: 0,
				medical: 0,
				total: 58.46,
				vision: 10
			},
			grossPay: 5769.23,
			annualized: {
				grossPay: 149999.98,
				estimatedAGI: 0,
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
			estimatedAGI: 0,
			estimatedMAGI: 0,
			totalsForAllChecks: {
				contributionHsa: 807.66,
				benefitsCost: 1227.66,
				contribution401k: 0,
				grossPay: 121153.83,
				estimatedAGI: 0,
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
			estimatedAGI: 0,
			estimatedMAGI: 0,
			estimatedTakeHomePay: 0,
			federalTaxCosts: {
				effectiveRate: 0,
				amount: 0
			}
		}
	],
	pastPaychecks: [
		{
			startDate: '2022-01-01',
			endDate: '2022-03-11',
			estimatedTakeHomePay: 0,
			annualized: {
				grossPay: 96835.18,
				estimatedAGI: 0,
				estimatedMAGI: 0
			},
			benefitsCost: {
				dental: 5.84,
				hsa: 38.46,
				fsa: 0,
				medical: 68.92,
				total: 116.57,
				vision: 3.35
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
			estimatedAGI: 0,
			estimatedMAGI: 0,
			totalsForAllChecks: {
				contributionHsa: 192.6,
				benefitsCost: 582.85,
				contribution401k: 3910.6515,
				grossPay: 18622.15,
				estimatedAGI: 0,
				estimatedMAGI: 0,
				estimatedTakeHomePay: 0
			},
			federalTaxCost: {
				effectiveRate: 0,
				amount: 0
			}
		}
	],
	totals: {
		past: {
			contribution401k: 7821.303,
			contributionHsa: 0,
			grossPay: 33710.15,
			estimatedAGI: 0,
			estimatedMAGI: 0,
			estimatedTakeHomePay: 0
		},
		future: {
			contribution401k: 0,
			contributionHsa: 0,
			grossPay: 126153.83,
			estimatedAGI: 0,
			estimatedMAGI: 0,
			estimatedTakeHomePay: 0
		},
		combined: {
			grossPay: 0,
			contributionHsa: 0,
			contribution401k: 0,
			estimatedAGI: 0,
			estimatedMAGI: 0,
			estimatedTakeHomePay: 0
		},
		combinedWithAdditionalIncome: {
			contributionHsa: 0,
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
		taxableInvestmentIncome: 0,
		total: {
			grossPay: 0,
			estimatedAGI: 0,
			estimatedMAGI: 0
		}
	}
};

describe('addFuture401k', () => {
	it('adds future 401k data', () => {
		const result = pipe(
			getTestData(),
			IOEither.map(
				(data): DataWithTotals => ({
					legalData: {
						...data.legalData
					},
					personalData
				})
			),
			IOEither.map(addFuture401k)
		)();
		expect(result).toEqualRight({
			...personalData,
			futurePaychecks: [
				{
					...personalData.futurePaychecks[0],
					paycheck401k: {
						rate: 0.1,
						amount: 576.923
					},
					totalsForAllChecks: {
						...personalData.futurePaychecks[0].totalsForAllChecks,
						contribution401k: 12115.383
					}
				}
			],
			futureBonuses: [
				{
					...personalData.futureBonuses[0],
					bonus401k: {
						rate: 0.1,
						amount: 500
					}
				}
			],
			totals: {
				...personalData.totals,
				future: {
					...personalData.totals.future,
					contribution401k: 12615.383
				}
			},
			futureRate401k: 0.1
		});
	});
});
