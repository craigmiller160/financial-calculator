import { FederalTaxBracket } from '../../../src/data/decoders';
import { calculateTaxes } from '../../../src/calculations/utils/calculateTaxes';
import Decimal from 'decimal.js';

const bracket: FederalTaxBracket = {
	rate: 0.22,
	minimumIncome: 20_000,
	maximumIncome: 50_000,
	baseAmountOwed: 5_000
};

describe('calculateTaxes', () => {
	it('does the calculation', () => {
		const result = calculateTaxes(new Decimal(36_000))(bracket);
		expect(result).toEqual(new Decimal(8520));
	});
});
