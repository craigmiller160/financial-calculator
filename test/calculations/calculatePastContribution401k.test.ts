import { createContext, Context } from '../../src/context';
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
			expect.objectContaining<
				Omit<Context, 'personalData' | 'legalData' | 'payrollTaxes'>
			>({
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
							employeeContribution: 687.5,
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
					],
					contributionsByBonus: [
						{
							name: 'Cigna Annual Bonus',
							employeeContribution: 3168.48,
							employerContribution: 754.4
						},
						{
							name: 'Final Cigna Payout',
							employeeContribution: 0,
							employerContribution: 0
						}
					]
				}
			})
		);
	});
});
