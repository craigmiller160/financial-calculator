import { BaseContext } from '../context';
import {
	Contribution401k,
	Contribution401kByItem
} from '../context/contribution401k';
import { Paycheck } from '../data/decoders/personalData';
import { findNamedItemE } from '../utils/finders';
import { pipe } from 'fp-ts/function';
import * as Either from 'fp-ts/Either';
import { TryT } from '@craigmiller160/ts-functions/types';
import { times } from '../utils/decimalMath';

const getTotalContributionForAllChecks = (
	paychecks: ReadonlyArray<Paycheck>,
	contribution: Contribution401kByItem
): TryT<Contribution401kByItem> =>
	pipe(
		findNamedItemE(paychecks)(contribution.name),
		Either.map(
			(paycheck): Contribution401kByItem => ({
				name: contribution.name,
				employeeContribution: times(paycheck.numberOfChecks)(
					contribution.employeeContribution
				),
				employerContribution: times(paycheck.numberOfChecks)(
					contribution.employerContribution
				)
			})
		)
	);

const getTotalPastContribution = (
	context: BaseContext,
	pastContributions401k: Contribution401k
): number => {};

export const calculateFuture401kRate = (
	context: BaseContext,
	pastContribution401k: Contribution401k
): number => {
	throw new Error();
};
