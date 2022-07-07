import { annualizePayPeriodValue } from '../../../src/calculations/utils/annualizePayPeriodValue';

describe('annualizePayPeriodValue', () => {
	it('annualizes value for pay period', () => {
		const result = annualizePayPeriodValue(10);
		expect(result).toEqual(260);
	});
});
