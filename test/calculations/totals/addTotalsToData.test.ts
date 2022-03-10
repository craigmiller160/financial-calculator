import { pipe } from 'fp-ts/function';
import { getTestData } from '../../testutils/TestData';
import * as IOEither from 'fp-ts/IOEither';
import '@relmify/jest-fp-ts';
import { addTotalsToData } from '../../../src/calculations/totals/addTotalsToData';

describe('addTotalsToData', () => {
	it('all totals are calculated', () => {
		const result = pipe(getTestData(), IOEither.map(addTotalsToData))();
		expect(result).toEqualRight(
			expect.objectContaining({
				personalData: {
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
							taxablePay: 4617.5
						}
					],
					futurePaychecks: [
						{
							startDate: '2022-03-14',
							endDate: '2022-12-31',
							benefitsCost: {
								dental: 10,
								hsa: 38.46,
								medical: 0,
								total: 58.46,
								vision: 10
							},
							grossPay: 5769.23,
							annualized: {
								grossPay: 149999.98,
								taxablePay: 137005.02153
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
							taxablePay: 5269.423905,
							totalsForAllChecks: {
								benefitsCost: 1227.66,
								contribution401k: 0,
								grossPay: 121153.83,
								taxablePay: 110657.902005
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
							taxablePay: 10765.288
						}
					],
					pastPaychecks: [
						{
							startDate: '2022-01-01',
							endDate: '2022-03-11',
							annualized: {
								grossPay: 96835.18,
								taxablePay: 66061.08093
							},
							benefitsCost: {
								dental: 5.84,
								hsa: 38.46,
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
							taxablePay: 2540.810805,
							totalsForAllChecks: {
								benefitsCost: 582.85,
								contribution401k: 3910.6515,
								grossPay: 18622.15,
								taxablePay: 12704.054025
							}
						}
					],
					totals: {
						futureContribution401k: 0,
						futureGrossPay: 126153.83,
						futureTaxablePay: 115275.402005,
						pastContribution401k: 7079.1314999999995,
						pastGrossPay: 33710.15,
						pastTaxablePay: 23469.342024999998
					}
				}
			})
		);
	});
});
