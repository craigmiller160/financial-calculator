import { getTestBaseContext } from '../testutils/getTestContext';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import { calculateFutureContribution401k } from '../../src/calculations/calculateFutureContribution401k';
import { Contribution401k } from '../../src/context/contribution401k';
import '@relmify/jest-fp-ts';
import { BaseContext } from '../../src/context';

describe('calculateFutureContribution401k', () => {
	it('does the calculation', () => {
		const result = pipe(
			getTestBaseContext(),
			IOEither.map(
				(context): BaseContext => ({
					...context,
					personalData: {
						...context.personalData,
						futureBonuses: [
							{
								name: 'Special Bonus',
								date: '2022-12-31',
								grossPay: 1000,
								rates401k: {
									employerRate: 0.05,
									employeeRate: undefined
								}
							}
						]
					}
				})
			),
			IOEither.map((context) =>
				calculateFutureContribution401k(context, 0.2)
			)
		)();
		const expectedResult: Contribution401k = {
			contributionsByBonus: [
				{
					name: 'Special Bonus',
					employerContribution: 50,
					employeeContribution: 200
				}
			],
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
