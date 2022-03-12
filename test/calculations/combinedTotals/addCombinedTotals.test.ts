import input from '../../__test-data__/other/combinedTotalInput.json';
import { PersonalDataWithTotals } from '../../../src/calculations/totals/TotalTypes';
import { addCombinedTotals } from '../../../src/calculations/combinedTotals/addCombinedTotals';
import produce from 'immer';

const inputData = input as PersonalDataWithTotals;

describe('addCombinedTotals', () => {
	it('calculates and adds the combined totals', () => {
		const result = addCombinedTotals(inputData);
		const expectedResult = produce(inputData, (draft) => {
			draft.totals = {
				pastGrossPay: 33710.15,
				pastContribution401k: 7079.1315,
				pastEstimatedAGI: 23469.342025,
				pastEstimatedMAGI: 23469.342025,
				futureGrossPay: 121153.83,
				futureContribution401k: 13326.9213,
				futureEstimatedAGI: 97330.98070499998,
				futureEstimatedMAGI: 97330.98070499998,
				pastEstimatedTakeHomePay: 250,
				futureEstimatedTakeHomePay: 100
			};
		});
		expect(result).toEqual(expectedResult);
	});
});
