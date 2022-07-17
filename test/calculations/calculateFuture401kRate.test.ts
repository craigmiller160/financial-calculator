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
import '@relmify/jest-fp-ts';

const generatePastContribution401k = (
	context: BaseContext
): Contribution401k => {
	const contributionsByPaycheck = pipe(
		context.personalData.pastPaychecks,
		RArray.map(
			(paycheck): Contribution401kByItem => ({
				name: paycheck.name,
				employeeContribution: 500,
				employerContribution: 500
			})
		)
	);
	const contributionsByBonus = pipe(
		context.personalData.pastBonuses,
		RArray.map(
			(bonus): Contribution401kByItem => ({
				name: bonus.name,
				employeeContribution: 500,
				employerContribution: 500
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
		const resultEither = pipe(
			prepareTestData(),
			IOEither.chainEitherK(([context, contribution]) =>
				calculateFuture401kRate(context, contribution)
			)
		)();
		// 9,000 in past contributions, 11,500 in remaining contributions
		// 57,692.30 in future income
		expect(resultEither).toEqualRight(0.199);
	});

	it('cannot find a past paycheck', () => {
		const resultEither = pipe(
			prepareTestData(),
			IOEither.map(
				([context, contribution]): TestData => [
					context,
					{
						...contribution,
						contributionsByPaycheck:
							contribution.contributionsByPaycheck.slice(1)
					}
				]
			),
			IOEither.chainEitherK(([context, contribution]) =>
				calculateFuture401kRate(context, contribution)
			)
		)();
		expect(resultEither).toEqualLeft(
			new Error('Unable to find named item: Cigna Paycheck')
		);
	});
});
