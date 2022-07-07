import { totalValueForChecks } from '../../../src/calculations/utils/totalValueForChecks';

describe('totalValueForChecks', () => {
	it('gets total value', () => {
		const result = totalValueForChecks(26.72, 13);
		expect(result).toEqual(347.36);
	});
});
