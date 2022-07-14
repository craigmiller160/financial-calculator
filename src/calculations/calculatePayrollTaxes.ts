import { Context } from '../context';
import { PayrollTaxRates } from '../data/decoders/legalData';
import { PayrollTaxesByItem } from '../context/payrollTaxes';
import { times } from '../utils/decimalMath';
import * as RArray from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';

interface Item {
	readonly name: string;
	readonly grossPay: number;
}

const createItemToPayrollTaxes =
	(rates: PayrollTaxRates) =>
	(item: Item): PayrollTaxesByItem => ({
		name: item.name,
		socialSecurityAmount: times(item.grossPay)(rates.socialSecurity),
		medicareAmount: times(item.grossPay)(rates.medicare)
	});

export const calculatePayrollTaxes = (
	context: Omit<Context, 'payrollTaxes'>
): Context => {
	const itemToPayrollTaxes = createItemToPayrollTaxes(
		context.legalData.payrollTaxRates
	);
	const payrollTaxesByPaycheck: ReadonlyArray<PayrollTaxesByItem> = pipe(
		context.personalData.pastPaychecks,
		RArray.concat(context.personalData.futurePaychecks),
		RArray.map(itemToPayrollTaxes)
	);
	const payrollTaxesByBonus: ReadonlyArray<PayrollTaxesByItem> = pipe(
		context.personalData.pastBonuses,
		RArray.concat(context.personalData.futureBonuses),
		RArray.map(itemToPayrollTaxes)
	);

	return {
		...context,
		payrollTaxes: {
			payrollTaxesByPaycheck,
			payrollTaxesByBonus
		}
	};
};
