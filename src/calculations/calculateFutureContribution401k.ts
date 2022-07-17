import { BaseContext } from '../context';
import {
	Contribution401k,
	Contribution401kByItem
} from '../context/contribution401k';
import { Rates401k } from '../data/decoders/personalData';
import { times } from '../utils/decimalMath';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';

interface Item {
	readonly name: string;
	readonly grossPay: number;
	readonly rates401k: Rates401k;
}

const itemToContribution401k =
	(employeeRate: number) =>
	(item: Item): Contribution401kByItem => ({
		name: item.name,
		employerContribution: times(item.grossPay)(item.rates401k.employerRate),
		employeeContribution: times(item.grossPay)(employeeRate)
	});

export const calculateFutureContribution401k = (
	context: BaseContext,
	newRate401k: number
): Contribution401k => {
	const contributionsByPaycheck = pipe(
		context.personalData.futurePaychecks,
		RArray.map(itemToContribution401k(newRate401k))
	);
	const contributionsByBonus = pipe(
		context.personalData.futureBonuses,
		RArray.map(itemToContribution401k(newRate401k))
	);

	return {
		contributionsByPaycheck,
		contributionsByBonus
	};
};
