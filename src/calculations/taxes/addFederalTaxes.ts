import {
	BonusWithTotal,
	DataWithTotals,
	PaycheckWithTotal,
	PersonalDataWithTotals
} from '../totals/TotalTypes';
import { findTaxBracket } from '../utils/findTaxBracket';
import { LegalData } from '../../data/decoders';
import { pipe } from 'fp-ts/function';
import * as Either from 'fp-ts/Either';
import { calculateEffectiveTaxRate } from '../utils/calculateEffectiveTaxRate';
import produce, { castDraft } from 'immer';
import { TryT } from '@craigmiller160/ts-functions/types';
import * as RArray from 'fp-ts/ReadonlyArray';
import Decimal from 'decimal.js';

const BONUS_WITHHOLDING = 0.22;

const calculateTaxAmount = (agi: number, rate: number): number =>
	new Decimal(agi).times(new Decimal(rate)).toNumber();

const addFederalTaxesToPaycheck =
	(legalData: LegalData) =>
	(paycheck: PaycheckWithTotal): TryT<PaycheckWithTotal> =>
		pipe(
			findTaxBracket(
				legalData.federalTaxBrackets,
				paycheck.annualized.estimatedAGI
			),
			Either.map(calculateEffectiveTaxRate(paycheck.annualized.estimatedAGI)),
			Either.map((rate) =>
				produce(paycheck, (draft) => {
					draft.federalTaxCost = {
						effectiveRate: rate,
						amount: calculateTaxAmount(draft.estimatedAGI, rate)
					};
				})
			)
		);

const addFederalTaxesToBonus = (bonus: BonusWithTotal): BonusWithTotal =>
	produce(bonus, (draft) => {
		draft.federalTaxCosts.effectiveRate = BONUS_WITHHOLDING;
		draft.federalTaxCosts.amount = calculateTaxAmount(
			draft.estimatedAGI,
			BONUS_WITHHOLDING
		);
	});

export const addFederalTaxes = (
	data: DataWithTotals
): TryT<PersonalDataWithTotals> => {
	const pastPaychecksEither = pipe(
		data.personalData.pastPaychecks,
		RArray.map(addFederalTaxesToPaycheck(data.legalData)),
		Either.sequenceArray
	);
	const futurePaychecksEither = pipe(
		data.personalData.futurePaychecks,
		RArray.map(addFederalTaxesToPaycheck(data.legalData)),
		Either.sequenceArray
	);
	const pastBonuses = pipe(
		data.personalData.pastBonuses,
		RArray.map(addFederalTaxesToBonus)
	);
	const futureBonuses = pipe(
		data.personalData.futureBonuses,
		RArray.map(addFederalTaxesToBonus)
	);

	return pipe(
		pastPaychecksEither,
		Either.bindTo('pastPaychecks'),
		Either.bind('futurePaychecks', () => futurePaychecksEither),
		Either.map(({ pastPaychecks, futurePaychecks }) =>
			produce(data.personalData, (draft) => {
				draft.pastPaychecks = castDraft(pastPaychecks);
				draft.futurePaychecks = castDraft(futurePaychecks);
				draft.pastBonuses = castDraft(pastBonuses);
				draft.futureBonuses = castDraft(futureBonuses);
			})
		)
	);
};
