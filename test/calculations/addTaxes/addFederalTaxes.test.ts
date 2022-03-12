import input from '../../__test-data__/other/federalTaxesInput.json';
import { PersonalDataWithTotals } from '../../../src/calculations/totals/TotalTypes';
import { addFederalTaxes } from '../../../src/calculations/taxes/addFederalTaxes';
import { pipe } from 'fp-ts/function';
import { getTestData } from '../../testutils/TestData';
import * as IOEither from 'fp-ts/IOEither';
import '@relmify/jest-fp-ts';

const personalData = input as PersonalDataWithTotals;

describe('addFederalTaxes', () => {
	it('adds federal tax info', () => {
		pipe(
			getTestData(),
			IOEither.chainEitherK(({ legalData }) =>
				addFederalTaxes({ legalData, personalData })
			)
		);
	});
});
