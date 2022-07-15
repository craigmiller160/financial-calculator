import { pipe } from 'fp-ts/function';
import { getTestData } from '../testutils/getTestData';
import * as IOEither from 'fp-ts/IOEither';
import { createContext } from '../../src/context';
import { calculatePastContribution401k } from '../../src/calculations/calculatePastContribution401k';
import { calculatePayrollTaxes } from '../../src/calculations/calculatePayrollTaxes';

export {};

describe('calculatePayrollTaxes', () => {
	it('does the calculation', () => {
		const result = pipe(
			getTestData(),
			IOEither.map((data) => createContext(data)),
			IOEither.map(calculatePayrollTaxes)
		)();
		throw new Error();
	});
});
