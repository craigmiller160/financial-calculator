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
		expect(result).toEqualRight(
			expect.objectContaining({
				pastContribution401k: {
					contributionsByPaycheck: [
						{
							name: 'Cigna Paycheck',
							employeeContribution: 782.1303,
							employerContribution: 186.2215
						},
						{
							name: 'Cigna Final Paycheck',
							employeeContribution: 391.0662,
							employerContribution: 93.111
						},
						{
							name: 'ClearSpend First Check',
							employeeContribution: 0,
							employerContribution: 0
						},
						{
							name: 'ClearSpend Pre-401k Check',
							employeeContribution: 0,
							employerContribution: 0
						},
						{
							name: 'ClearSpend 401k Check',
							employeeContribution: 6250.0,
							employerContribution: 312.5
						},
						{
							name: 'ClearSpend Final Check',
							employeeContribution: 0,
							employerContribution: 0
						},
						{
							name: 'Schellman Pre-401k Check',
							employeeContribution: 0,
							employerContribution: 0
						}
					]
				}
			})
		);
	});
});
