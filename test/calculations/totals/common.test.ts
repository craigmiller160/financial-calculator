import { Rate401k } from '../../../src/data/decoders';
import {
	getAmount401k,
	getRate401k
} from '../../../src/calculations/totals/common';

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
		throw new Error();
	});
});
