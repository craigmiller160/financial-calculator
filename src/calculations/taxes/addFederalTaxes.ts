import {
	PaycheckWithTotal,
	PersonalDataWithTotals
} from '../totals/TotalTypes';
import { findTaxBracket } from '../utils/findTaxBracket';
import { LegalData } from '../../data/decoders';
import { pipe } from 'fp-ts/function';
import * as Either from 'fp-ts/Either';
import { calculateTaxes } from '../utils/calculateTaxes';
import produce from 'immer';
import { TryT } from '@craigmiller160/ts-functions/types';
import * as RArray from 'fp-ts/ReadonlyArray';

const addFederalTaxesToPaycheck =
	(legalData: LegalData) =>
	(paycheck: PaycheckWithTotal): TryT<PaycheckWithTotal> =>
		pipe(
			findTaxBracket(
				legalData.federalTaxBrackets,
				paycheck.annualized.estimatedAGI
			),
			Either.map(calculateTaxes(paycheck.estimatedAGI)),
			Either.map(([rate, amount]) =>
				produce(paycheck, (draft) => {
					draft.federalTaxCost = {
						effectiveRate: rate,
						amount
					};
				})
			)
		);

export const addFederalTaxes =
	(legalData: LegalData) =>
	(data: PersonalDataWithTotals): PersonalDataWithTotals => {
		const pastPaychecksEither = pipe(
			data.pastPaychecks,
			RArray.map(addFederalTaxesToPaycheck(legalData)),
			Either.sequenceArray
		);
		const futurePaychecksEither = pipe(
			data.futurePaychecks,
			RArray.map(addFederalTaxesToPaycheck(legalData)),
			Either.sequenceArray
		);

		pipe(
			pastPaychecksEither,
			Either.bindTo('pastPaychecks'),
			Either.bind('futurePaychecks', () => futurePaychecksEither)
		);

		throw new Error();
	};
