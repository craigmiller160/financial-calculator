import { getTestData } from '../../testutils/TestData';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import { addTotalsToPaycheck } from '../../../src/calculations/totals/addTotalsToPaychecks';
import '@relmify/jest-fp-ts';

describe('addTotalsToPaychecks', () => {
	it('adds the totals to past paychecks', () => {
		const result = pipe(
			getTestData(),
			IOEither.map((data) =>
				addTotalsToPaycheck(data.legalData)(
					data.personalData.pastPaychecks[0]
				)
			)
		)();
		expect(result).toEqualRight({
			startDate: '2022-01-01',
			endDate: '2022-03-11',
			benefitsCost: {
				dental: 5.84,
				hsa: 38.46,
				medical: 68.92,
				vision: 3.35,
				total: 116.57
			},
			numberOfChecks: 5,
			grossPay: 3724.43,
			paycheck401k: {
				rate: 0.21,
				amount: 782.1303
			},
			taxablePay: 2825.7297,
			totalsForAllChecks: {
				contribution401k: 3910.6515,
				benefitsCost: 582.85,
				grossPay: 18622.15,
				taxablePay: 14128.6485
			}
		});
	});

	it('adds the totals to future paychecks', () => {
		const result = pipe(
			getTestData(),
			IOEither.map((data) =>
				addTotalsToPaycheck(data.legalData)(
					data.personalData.futurePaychecks[0]
				)
			)
		)();
		expect(result).toEqualRight({
			startDate: '2022-03-14',
			endDate: '2022-12-31',
			benefitsCost: {
				dental: 5.84,
				hsa: 38.46,
				medical: 0,
				vision: 3.35,
				total: 47.65
			},
			numberOfChecks: 21,
			grossPay: 5769.23,
			paycheck401k: {
				rate: 0,
				amount: 0
			},
			taxablePay: 5721.58,
			totalsForAllChecks: {
				contribution401k: 0,
				benefitsCost: 1000.65,
				grossPay: 121153.83,
				taxablePay: 120153.18
			}
		});
	});
});
