import {
	BonusWithTotal,
	PaycheckWithTotal,
	PersonalDataWithTotals
} from '../totals/TotalTypes';
import { findTaxBracket } from '../utils/findTaxBracket';
import { LegalData } from '../../data/decoders';
import { pipe } from 'fp-ts/function';
import * as Either from 'fp-ts/Either';
import { calculateTaxes } from '../utils/calculateTaxes';
import produce, { castDraft } from 'immer';
import { TryT } from '@craigmiller160/ts-functions/types';
import * as RArray from 'fp-ts/ReadonlyArray';
import Decimal from 'decimal.js';

const BONUS_WITHHOLDING = 0.22;

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

const addFederalTaxesToBonus = (bonus: BonusWithTotal): BonusWithTotal =>
	produce(bonus, (draft) => {
		draft.federalTaxCosts.effectiveRate = BONUS_WITHHOLDING;
		draft.federalTaxCosts.amount = new Decimal(draft.estimatedAGI)
			.times(new Decimal(BONUS_WITHHOLDING))
			.toNumber();
	});

export const addFederalTaxes =
	(legalData: LegalData) =>
	(data: PersonalDataWithTotals): TryT<PersonalDataWithTotals> => {
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
		const pastBonuses = pipe(
			data.pastBonuses,
			RArray.map(addFederalTaxesToBonus)
		);
		const futureBonuses = pipe(
			data.futureBonuses,
			RArray.map(addFederalTaxesToBonus)
		);

		return pipe(
			pastPaychecksEither,
			Either.bindTo('pastPaychecks'),
			Either.bind('futurePaychecks', () => futurePaychecksEither),
			Either.map(({ pastPaychecks, futurePaychecks }) =>
				produce(data, (draft) => {
					draft.pastPaychecks = castDraft(pastPaychecks);
					draft.futurePaychecks = castDraft(futurePaychecks);
					draft.pastBonuses = castDraft(pastBonuses);
					draft.futureBonuses = castDraft(futureBonuses);
				})
			)
		);
	};
