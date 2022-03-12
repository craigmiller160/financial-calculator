import input from '../../__test-data__/other/takeHomePayInput.json';
import { PersonalDataWithTotals } from '../../../src/calculations/totals/TotalTypes';
import { addTakeHomePay } from '../../../src/calculations/takeHome/addTakeHomePay';
import produce from 'immer';

const inputData = input as PersonalDataWithTotals;

describe('addTakeHomePay', () => {
	it('adds take home pay', () => {
		const result = addTakeHomePay(input);
		const expectedResult = produce(inputData, (draft) => {
			draft.pastBonuses[0].estimatedTakeHomePay = 8396.92464;
			draft.futurePaychecks[0].estimatedTakeHomePay = 3759.550693646153;
			// noinspection JSConstantReassignment
			draft.futurePaychecks[0].totalsForAllChecks.estimatedTakeHomePay = 78950.56456656921;
			draft.pastPaychecks[0].estimatedTakeHomePay = 2150.409350976923;
			// noinspection JSConstantReassignment
			draft.pastPaychecks[0].totalsForAllChecks.estimatedTakeHomePay = 10752.046754884615;
		});
		expect(result).toEqual(expectedResult);
	});
});
