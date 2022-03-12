import {
	BonusWithTotal,
	PaycheckWithTotal,
	PersonalDataWithTotals
} from '../totals/TotalTypes';
import produce, { castDraft } from 'immer';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import Decimal from 'decimal.js';

const addTakeHomeForBonus = (bonus: BonusWithTotal): BonusWithTotal =>
	produce(bonus, (draft) => {
		draft.estimatedTakeHomePay =
			draft.estimatedAGI - draft.federalTaxCosts.amount;
	});

const addTakeHomeForPaycheck = (
	paycheck: PaycheckWithTotal
): PaycheckWithTotal =>
	produce(paycheck, (draft) => {
		draft.estimatedTakeHomePay =
			draft.estimatedAGI - draft.federalTaxCost.amount;
		draft.totalsForAllChecks.estimatedTakeHomePay = new Decimal(
			draft.estimatedTakeHomePay
		)
			.times(new Decimal(draft.numberOfChecks))
			.toNumber();
	});

export const addTakeHomePay = (
	data: PersonalDataWithTotals
): PersonalDataWithTotals => {
	const pastBonuses = pipe(data.pastBonuses, RArray.map(addTakeHomeForBonus));
	const futureBonuses = pipe(
		data.futureBonuses,
		RArray.map(addTakeHomeForBonus)
	);
	const pastPaychecks = pipe(
		data.pastPaychecks,
		RArray.map(addTakeHomeForPaycheck)
	);
	const futurePaychecks = pipe(
		data.futurePaychecks,
		RArray.map(addTakeHomeForPaycheck)
	);
	return produce(data, (draft) => {
		draft.pastBonuses = castDraft(pastBonuses);
		draft.futureBonuses = castDraft(futureBonuses);
		draft.pastPaychecks = castDraft(pastPaychecks);
		draft.futurePaychecks = castDraft(futurePaychecks);
	});
};
