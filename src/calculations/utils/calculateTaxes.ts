import Decimal from 'decimal.js';
import { FederalTaxBracket } from '../../data/decoders';

export const calculateTaxes =
	(income: Decimal) =>
	(bracket: FederalTaxBracket): Decimal => {
		const base = new Decimal(bracket.baseAmountOwed);
		const rate = new Decimal(bracket.rate);
		const minimum = new Decimal(bracket.minimumIncome);
		const remainingIncome = income.minus(minimum);
		const remainingTax = remainingIncome.times(rate);
		return base.plus(remainingTax);
	};
