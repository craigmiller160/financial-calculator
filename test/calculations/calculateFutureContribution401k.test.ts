import { getTestBaseContext } from '../testutils/getTestContext';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import { calculateFutureContribution401k } from '../../src/calculations/calculateFutureContribution401k';
import { Contribution401k } from '../../src/context/contribution401k';
import '@relmify/jest-fp-ts';

describe('calculateFutureContribution401k', () => {
	it('does the calculation', () => {
		const result = pipe(
			getTestBaseContext(),
			IOEither.map((context) =>
				calculateFutureContribution401k(context, 0.2)
			)
		)();
		// TODO add bonus
		const expectedResult: Contribution401k = {
			contributionsByBonus: [],
			contributionsByPaycheck: [
				{
					name: 'Schellman 401k Check',
					employerContribution: 288.4615,
					employeeContribution: 1153.846
				}
			]
		};
		expect(result).toEqualRight(expectedResult);
	});
});
