import { Context } from '../context';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import { Bonus, Paycheck } from '../data/decoders/personalData';
import { Contribution401kByItem } from '../context/contribution401k';

const paycheckToContribution401k = (
	paycheck: Paycheck
): Contribution401kByItem => ({
	name: paycheck.name,
	employeeContribution: 0,
	employerContribution: 0
});

const bonusToContribution401k = (bonus: Bonus): Contribution401kByItem => ({
	name: bonus.name,
	employeeContribution: 0,
	employerContribution: 0
});

export const calculatePastContribution401k = (
	context: Omit<Context, 'pastContribution401k'>
): Context => {
	const contributionsByPaycheck = pipe(
		context.personalData.pastPaychecks,
		RArray.map(paycheckToContribution401k)
	);
	const contributionsByBonus = pipe(
		context.personalData.pastBonuses,
		RArray.map(bonusToContribution401k)
	);
	return {
		...context,
		pastContribution401k: {
			contributionsByPaycheck,
			contributionsByBonus
		}
	};
};
