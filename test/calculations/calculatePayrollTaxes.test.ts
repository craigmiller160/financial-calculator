import { pipe } from 'fp-ts/function';
import { getTestData } from '../testutils/getTestData';
import * as IOEither from 'fp-ts/IOEither';
import { createContext } from '../../src/context';
import { calculatePayrollTaxes } from '../../src/calculations/calculatePayrollTaxes';
import '@relmify/jest-fp-ts';

describe('calculatePayrollTaxes', () => {
	it('does the calculation', () => {
		const result = pipe(
			getTestData(),
			IOEither.map((data) => createContext(data)),
			IOEither.map(calculatePayrollTaxes)
		)();
		expect(result).toEqualRight({
			payrollTaxesByPaycheck: [
				{
					name: 'Cigna Paycheck',
					socialSecurityAmount: 230.91466,
					medicareAmount: 54.004235
				},
				{
					name: 'Cigna Final Paycheck',
					socialSecurityAmount: 115.45764,
					medicareAmount: 27.00219
				},
				{
					name: 'ClearSpend First Check',
					socialSecurityAmount: 70.45432,
					medicareAmount: 16.47722
				},
				{
					name: 'ClearSpend Pre-401k Check',
					socialSecurityAmount: 387.5,
					medicareAmount: 90.625
				},
				{
					name: 'ClearSpend 401k Check',
					socialSecurityAmount: 387.5,
					medicareAmount: 90.625
				},
				{
					name: 'ClearSpend Final Check',
					socialSecurityAmount: 35.22716,
					medicareAmount: 8.23861
				},
				{
					name: 'Schellman Pre-401k Check',
					socialSecurityAmount: 357.69226,
					medicareAmount: 83.653835
				},
				{
					name: 'Schellman 401k Check',
					socialSecurityAmount: 357.69226,
					medicareAmount: 83.653835
				}
			],
			payrollTaxesByBonus: [
				{
					name: 'Cigna Annual Bonus',
					socialSecurityAmount: 935.456,
					medicareAmount: 218.776
				},
				{
					name: 'Final Cigna Payout',
					socialSecurityAmount: 244.5962,
					medicareAmount: 57.20395
				}
			]
		});
	});
});
