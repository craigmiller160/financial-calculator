import { getTestData } from '../testutils/TestData';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import { calculatePastData } from '../../src/calculations/calculatePastData';
import '@relmify/jest-fp-ts';

describe('calculatePastData', () => {
	it('performs the calculations', () => {
		const result = pipe(
			getTestData(),
			IOEither.map(calculatePastData),
			IOEither.map((decimalResult) => ({
				total401kContribution:
					decimalResult.total401kContribution.toFixed(2),
				totalTaxableIncome: decimalResult.totalTaxableIncome.toFixed(2)
			}))
		)();
		expect(result).toEqualRight({
			total401kContribution: '3950.61',
			totalTaxableIncome: '26597.86'
		});
	});
});
