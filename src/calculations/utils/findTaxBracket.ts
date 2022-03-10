import { FederalTaxBracket } from '../../data/decoders';
import { PredicateT, TryT } from '@craigmiller160/ts-functions/types';
import { pipe } from 'fp-ts/function';
import Decimal from 'decimal.js';
import * as Option from 'fp-ts/Option';
import * as Pred from 'fp-ts/Predicate';
import * as RArray from 'fp-ts/ReadonlyArray';
import * as Either from 'fp-ts/Either';

const isOverMin =
	(income: Decimal): PredicateT<FederalTaxBracket> =>
	(bracket) =>
		bracket.minimumIncome <= income.toNumber();
const isUnderMax =
	(income: Decimal): PredicateT<FederalTaxBracket> =>
	(bracket) => {
		const max = pipe(
			Option.fromNullable(bracket.maximumIncome),
			Option.getOrElse(() => Number.MAX_SAFE_INTEGER)
		);
		return max >= income.toNumber();
	};
const currentTaxBracket = (income: Decimal): PredicateT<FederalTaxBracket> =>
	pipe(isOverMin(income), Pred.and(isUnderMax(income)));

export const findTaxBracket = (
	federalTaxBrackets: ReadonlyArray<FederalTaxBracket>,
	totalTaxableIncomeForYear: Decimal
): TryT<FederalTaxBracket> =>
	pipe(
		federalTaxBrackets,
		RArray.findFirst(currentTaxBracket(totalTaxableIncomeForYear)),
		Either.fromOption(
			() =>
				new Error('Unable to find tax bracket. Check tax bracket data.')
		)
	);
