import { Rate401k } from '../../../src/data/decoders';
import {
	getAmount401k,
	getPayrollTaxCosts,
	getRate401k
} from '../../../src/calculations/totals/common';
import { getTestData } from '../../testutils/TestData';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import '@relmify/jest-fp-ts';

const valueWith401k: Rate401k = {
	rate401k: 10
};

describe('totals common', () => {
	it('getRate401k', () => {
		const resultWith401k = getRate401k(valueWith401k);
		const resultWithout401k = getRate401k({ foo: 'bar' });
		expect(resultWith401k).toEqual(10);
		expect(resultWithout401k).toEqual(0);
	});

	it('getAmount401k', () => {
		const result = getAmount401k(175.2, 0.15);
		expect(result).toEqual(26.28);
	});

	it('getPayrollTaxCosts', () => {
		const result = pipe(
			getTestData(),
			IOEither.map((data) =>
				getPayrollTaxCosts(1000, data.legalData.payrollTaxRates)
			)
		)();
		expect(result).toEqualRight({
			socialSecurity: 62,
			medicare: 14.5,
			total: 76.5
		});
	});
});
