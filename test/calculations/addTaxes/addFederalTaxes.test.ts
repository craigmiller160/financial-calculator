import input from '../../__test-data__/other/federalTaxesInput.json';
import { PersonalDataWithTotals } from '../../../src/calculations/totals/TotalTypes';
import {
	addFederalTaxes,
	BONUS_WITHHOLDING
} from '../../../src/calculations/taxes/addFederalTaxes';
import { pipe } from 'fp-ts/function';
import { getTestData } from '../../testutils/TestData';
import * as IOEither from 'fp-ts/IOEither';
import '@relmify/jest-fp-ts';

const personalData = input as PersonalDataWithTotals;

describe('addFederalTaxes', () => {
	it('adds federal tax info', () => {
		const result = pipe(
			getTestData(),
			IOEither.chainEitherK(({ legalData }) =>
				addFederalTaxes({ legalData, personalData })
			)
		)();
		expect(result).toEqualRight(
			expect.objectContaining({
				pastPaychecks: personalData.pastPaychecks.map((paycheck) => ({
					...paycheck,
					federalTaxCost: {
						effectiveRate: 0.15365231179543765,
						amount: 390.40145402307695
					}
				})),
				pastBonuses: personalData.pastBonuses.map((bonus) => ({
					...bonus,
					federalTaxCosts: {
						effectiveRate: BONUS_WITHHOLDING,
						amount: 2368.36336
					}
				})),
				futureBonuses: [],
				futurePaychecks: personalData.futurePaychecks.map(
					(paycheck) => ({
						...paycheck,
						federalTaxCost: {
							effectiveRate: 0.18884445636215136,
							amount: 875.2579113538459
						}
					})
				)
			})
		);
	});
});
