import { getTestData } from '../../testutils/TestData';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import { addTotalsToBonus } from '../../../src/calculations/totals/addTotalsToBonus';
import '@relmify/jest-fp-ts';

describe('addTotalsToBonus', () => {
	it('adds the totals for past bonus', () => {
		const result = pipe(
			getTestData(),
			IOEither.map((data) =>
				addTotalsToBonus(data.legalData)(
					data.personalData.pastBonuses[0]
				)
			)
		)();
		expect(result).toEqualRight({
			date: '2022-03-11',
			grossPay: 15088,
			taxablePay: 10765.288,
			bonus401k: {
				rate: 0.21,
				amount: 3168.48
			},
			payrollTaxCosts: {
				socialSecurity: 935.456,
				medicare: 218.776,
				total: 1154.232
			}
		});
	});

	it('adds the totals for future bonus', () => {
		throw new Error();
	});
});
