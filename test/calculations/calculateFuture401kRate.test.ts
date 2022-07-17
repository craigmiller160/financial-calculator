import {
	Contribution401k,
	Contribution401kByItem
} from '../../src/context/contribution401k';
import { Data } from '../../src/data/getData';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';

const generatePastContribution401k = (data: Data): Contribution401k => {
	const contributionsByPaycheck = pipe(
		data[0].pastPaychecks,
		RArray.map(
			(paycheck): Contribution401kByItem => ({
				name: paycheck.name,
				employeeContribution: 1000,
				employerContribution: 1000
			})
		)
	);
	const contributionsByBonus = pipe(
		data[0].pastBonuses,
		RArray.map(
			(bonus): Contribution401kByItem => ({
				name: bonus.name,
				employeeContribution: 1000,
				employerContribution: 1000
			})
		)
	);
	return {
		contributionsByPaycheck,
		contributionsByBonus
	};
};

describe('calculateFuture401kRate', () => {
	it('calculate the rate', () => {
		throw new Error();
	});

	it('cannot find a past paycheck', () => {
		throw new Error();
	});
});
