import { getData } from './data';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import { Data, FederalTaxBracket } from './data/decoders';
import Decimal from 'decimal.js';
import { PredicateT, TryT } from '@craigmiller160/ts-functions/types';
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

const calculateTaxes =
	(income: Decimal) =>
	(bracket: FederalTaxBracket): Decimal => {
		const base = new Decimal(bracket.baseAmountOwed);
		const rate = new Decimal(bracket.rate);
		const minimum = new Decimal(bracket.minimumIncome);
		const remainingIncome = income.minus(minimum);
		const remainingTax = remainingIncome.times(rate);
		return base.plus(remainingTax);
	};

const calculatePastTaxes = (
	data: Data
): TryT<[Decimal, Decimal, Decimal, Decimal]> => {
	const grossPay = data.personalData.pastPaychecks[0].grossPay;
	const taxableIncome1 = grossPay - 5.84 - 38.46 - 68.92 - 3.35;
	const taxableIncome2 = taxableIncome1 - grossPay * 0.21;
	// const bonus = 15088 - (15088 * 0.21);
	const totalIncome = new Decimal(taxableIncome2 * 26);

	return pipe(
		data.legalData.federalTaxBrackets,
		RArray.findFirst(currentTaxBracket(totalIncome)),
		Either.fromOption(() => new Error('Unable to find tax bracket')),
		Either.map((bracket) => {
			console.log('Bracket', bracket);
			return bracket;
		}),
		Either.map(calculateTaxes(totalIncome)),
		Either.map((taxes) => {
			const taxRate = taxes.dividedBy(totalIncome);
			const takeHomePay = new Decimal(taxableIncome2).sub(
				new Decimal(taxableIncome2).times(taxRate)
			);
			return [taxes, totalIncome, taxRate, takeHomePay];
		})
	);
};

pipe(
	getData(),
	IOEither.map(calculatePastTaxes),
	IOEither.map((value) => {
		console.log(value);
		return value;
	})
)();
