import { pipe } from 'fp-ts/function';
import { getTestData } from '../../testutils/TestData';
import * as IOEither from 'fp-ts/IOEither';
import '@relmify/jest-fp-ts';
import { addTotalsToData } from '../../../src/calculations/totals/addTotalsToData';

describe('addTotalsToData', () => {
	it('all totals are calculated', () => {
		const result = pipe(getTestData(), IOEither.map(addTotalsToData))();
		expect(result).toEqualRight({
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
						fsa: 0,
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
					estimatedAGI: 0,
					estimatedMAGI: 0,
					totalsForAllChecks: {
						contributionHsa: 192.3,
						benefitsCost: 582.85,
						contribution401k: 3910.6515,
						grossPay: 18622.15,
						estimatedAGI: 0,
						estimatedMAGI: 0,
						estimatedTakeHomePay: 0
					}
				}
			],
			totals: {
				past: {
					contributionHsa: 0,
					grossPay: 0,
					contribution401k: 0,
					estimatedAGI: 0,
					estimatedMAGI: 0,
					estimatedTakeHomePay: 0
				},
				future: {
					contributionHsa: 0,
					grossPay: 0,
					contribution401k: 0,
					estimatedAGI: 0,
					estimatedMAGI: 0,
					estimatedTakeHomePay: 0
				},
				combined: {
					contributionHsa: 0,
					grossPay: 0,
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
				taxableInvestmentIncome: 1000,
				total: {
					grossPay: 1000,
					estimatedAGI: 0,
					estimatedMAGI: 0
				}
			}
		});
	});
});
