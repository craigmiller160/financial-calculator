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
					totals: {
						futureContribution401k: 0,
						futureGrossPay: 126153.83,
						futureTaxablePay: 0, // TODO wrong
						pastContribution401k: 7821.303,
						pastGrossPay: 33710.15,
						pastTaxablePay: 25408.10805
					}
				}
			})
		);
	});
});
