import '@relmify/jest-fp-ts';
import { calculateFutureData } from '../../src/calculations/calculateFutureData';
import * as IOEither from 'fp-ts/IOEither';
import { pipe } from 'fp-ts/function';
import { getTestData } from '../testutils/TestData';

describe('calculateFutureData', () => {
	it('performs the calculations', () => {
		const result = pipe(
			getTestData(),
			IOEither.map(calculateFutureData),
			IOEither.map((decimalResult) => ({
				totalIncome: decimalResult.totalIncome.toFixed(2),
				payrollTaxesCost: decimalResult.payrollTaxesCost.toFixed(2),
				totalBenefitsCost: decimalResult.totalBenefitsCost.toFixed(2)
			}))
		)();
		expect(result).toEqualRight({
			totalIncome: '126153.83',
			payrollTaxesCost: '9650.77',
			totalBenefitsCost: '1227.66'
		});
	});
});
