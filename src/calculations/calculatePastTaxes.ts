import { PastData } from './CalculationTypes';
import { FederalTaxBracket, LegalData } from '../data/decoders';
import * as RArray from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { PredicateT, TryT } from '@craigmiller160/ts-functions/types';
import Decimal from 'decimal.js';
import * as Option from 'fp-ts/Option';
import * as Pred from 'fp-ts/Predicate';
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

const calculateTaxes =
	(income: Decimal) =>
	(bracket: FederalTaxBracket): Decimal => {
		const base = new Decimal(bracket.baseAmountOwed);
		const rate = new Decimal(bracket.rate);
		const remainingIncome = income.minus(base);
		const remainingTax = remainingIncome.times(rate);
		return base.plus(remainingTax);
	};

// TODO should do this per-paycheck
export const calculatePastTaxes = (
	pastData: PastData,
	legalData: LegalData
): TryT<Decimal> =>
	pipe(
		legalData.federalTaxBrackets,
		RArray.findFirst(currentTaxBracket(pastData.totalTaxableIncome)),
		Either.fromOption(() => new Error('Unable to find tax bracket')),
		Either.map(calculateTaxes(pastData.totalTaxableIncome))
	);
