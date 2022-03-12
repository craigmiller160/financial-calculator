import input from '../../__test-data__/other/addRothIraLimitInput.json';
import { PersonalDataWithTotals } from '../../../src/calculations/totals/TotalTypes';
import { pipe } from 'fp-ts/function';
import { getTestData } from '../../testutils/TestData';
import * as IOEither from 'fp-ts/IOEither';
import { addRothIraLimit } from '../../../src/calculations/rothIRA/addRothIraLimit';
import produce from 'immer';
import '@relmify/jest-fp-ts';

const personalData = input as PersonalDataWithTotals;

describe('addRothIraLimit', () => {
	it('adds the limit for Roth IRA contributions', () => {
		const result = pipe(
			getTestData(),
			IOEither.map(({ legalData }) =>
				addRothIraLimit({ legalData, personalData })
			)
		)();
		const expectedResult = produce(personalData, (draft) => {
			draft.rothIraLimit = 2400;
		});
		expect(result).toEqualRight(expectedResult);
	});
});
