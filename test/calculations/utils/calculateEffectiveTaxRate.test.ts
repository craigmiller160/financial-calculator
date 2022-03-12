import { FederalTaxBracket } from '../../../src/data/decoders';
import { calculateEffectiveTaxRate } from '../../../src/calculations/utils/calculateEffectiveTaxRate';

const bracket: FederalTaxBracket = {
	rate: 0.22,
	minimumIncome: 20_000,
	maximumIncome: 50_000,
	baseAmountOwed: 5_000
};

describe('calculateTaxes', () => {
	it('does the calculation', () => {
		const result = calculateEffectiveTaxRate(36_000)(bracket);
		expect(result).toEqual(0.23666666666666666);
	});
});
