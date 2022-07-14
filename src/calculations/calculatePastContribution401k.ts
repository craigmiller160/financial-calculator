import { Context } from '../context';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import { Rates401k } from '../data/decoders/personalData';
import { Contribution401kByItem } from '../context/contribution401k';
import { times } from '../utils/decimalMath';

interface Item {
	readonly name: string;
	readonly grossPay: number;
	readonly rates401k: Rates401k;
}

const itemToContribution401k = (item: Item): Contribution401kByItem => ({
	name: item.name,
	employeeContribution: times(item.grossPay)(
		item.rates401k.employeeRate ?? 0
	),
	employerContribution: times(item.grossPay)(item.rates401k.employerRate ?? 0)
});

export const calculatePastContribution401k = (
	context: Omit<Context, 'pastContribution401k' | 'payrollTaxes'>
): Omit<Context, 'payrollTaxes'> => {
	const contributionsByPaycheck = pipe(
		context.personalData.pastPaychecks,
		RArray.map(itemToContribution401k)
	);
	const contributionsByBonus = pipe(
		context.personalData.pastBonuses,
		RArray.map(itemToContribution401k)
	);
	return {
		...context,
		pastContribution401k: {
			contributionsByPaycheck,
			contributionsByBonus
		}
	};
};
