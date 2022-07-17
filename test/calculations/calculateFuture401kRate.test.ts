import {
	Contribution401k,
	Contribution401kByItem
} from '../../src/context/contribution401k';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import { BaseContext } from '../../src/context';
import { IOTryT } from '@craigmiller160/ts-functions/types';
import * as IOEither from 'fp-ts/IOEither';
import { getTestBaseContext } from '../testutils/getTestContext';
import { calculateFuture401kRate } from '../../src/calculations/calculateFuture401kRate';

const generatePastContribution401k = (
	context: BaseContext
): Contribution401k => {
	const contributionsByPaycheck = pipe(
		context.personalData.pastPaychecks,
		RArray.map(
			(paycheck): Contribution401kByItem => ({
				name: paycheck.name,
				employeeContribution: 1000,
				employerContribution: 1000
			})
		)
	);
	const contributionsByBonus = pipe(
		context.personalData.pastBonuses,
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

type TestData = [BaseContext, Contribution401k];

const prepareTestData = (): IOTryT<TestData> =>
	pipe(
		getTestBaseContext(),
		IOEither.bindTo('context'),
		IOEither.bind('contribution', ({ context }) =>
			IOEither.right(generatePastContribution401k(context))
		),
		IOEither.map(
			({ context, contribution }): TestData => [context, contribution]
		)
	);

describe('calculateFuture401kRate', () => {
	it('calculate the rate', () => {
		pipe(
			prepareTestData(),
			IOEither.map(([context, contribution]) =>
				calculateFuture401kRate(context, contribution)
			)
		);
		throw new Error();
	});

	it('cannot find a past paycheck', () => {
		throw new Error();
	});
});