import { createContext } from '../../src/context';
import { getTestData } from '../testutils/getTestData';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import { calculatePastContribution401k } from '../../src/calculations/calculatePastContribution401k';
import '@relmify/jest-fp-ts';

describe('calculatePastContribution401k', () => {
	it('does the calculations', () => {
		const result = pipe(
			getTestData(),
			IOEither.map((data) => createContext(data)),
			IOEither.map(calculatePastContribution401k)
		)();
		expect(result).toBeRight();
	});
});
