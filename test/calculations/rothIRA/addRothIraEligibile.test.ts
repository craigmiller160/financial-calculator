import input from '../../__test-data__/other/addRothIraLimitInput.json'
import { PersonalDataWithTotals } from '../../../src/calculations/totals/TotalTypes';
import { pipe } from 'fp-ts/function';
import { getTestData } from '../../testutils/TestData';
import * as IOEither from 'fp-ts/IOEither';

const inputData = input as PersonalDataWithTotals;

describe('addRothIraLimit', () => {
	it('adds the limit for Roth IRA contributions', () => {
		pipe(
			getTestData(),

		)
		throw new Error();
	});
});
