import Decimal from 'decimal.js';
import { FederalTaxBracket } from '../../data/decoders';

export const calculateTaxes =
	(income: number) =>
	(bracket: FederalTaxBracket): [rate: number, amount: number] => {
		const base = new Decimal(bracket.baseAmountOwed);
		const rate = new Decimal(bracket.rate);
		const minimum = new Decimal(bracket.minimumIncome);
		const remainingIncome = new Decimal(income).minus(minimum);
		const remainingTax = remainingIncome.times(rate);
		return [rate.toNumber(), base.plus(remainingTax).toNumber()];
	};
