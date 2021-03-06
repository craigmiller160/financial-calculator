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
				past: {
					grossPay: 33710.15,
					contribution401k: 7079.1315,
					contributionHsa: 192.6,
					estimatedAGI: 23469.342025,
					estimatedMAGI: 23469.342025,
					estimatedTakeHomePay: 19148.971394884615
				},
				future: {
					grossPay: 121153.83,
					contribution401k: 13326.9213,
					contributionHsa: 807.66,
					estimatedAGI: 97330.98070499998,
					estimatedMAGI: 97330.98070499998,
					estimatedTakeHomePay: 78950.56456656921
				},
				combined: {
					grossPay: 154863.98,
					contribution401k: 20406.0528,
					contributionHsa: 1000.26,
					estimatedAGI: 120800.32272999999,
					estimatedMAGI: 120800.32272999999,
					estimatedTakeHomePay: 98099.53596145383
				},
				combinedWithAdditionalIncome: {
					grossPay: 155863.98,
					contribution401k: 20406.0528,
					contributionHsa: 1000.26,
					estimatedAGI: 121800.32272999999,
					estimatedTakeHomePay: 98099.53596145383,
					estimatedMAGI: 121800.32272999999
				}
			};
		});
		expect(result).toEqual(expectedResult);
	});
});
