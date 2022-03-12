import { BonusWithTotal, PersonalDataWithTotals } from '../totals/TotalTypes';
import produce, { castDraft } from 'immer';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';

const addTakeHomeForBonus = (bonus: BonusWithTotal): BonusWithTotal =>
	produce(bonus, (draft) => {
		draft.estimatedTakeHomePay =
			draft.estimatedAGI - draft.federalTaxCosts.amount;
	});

export const addTakeHomePay = (
	data: PersonalDataWithTotals
): PersonalDataWithTotals => {
	const pastBonuses = pipe(data.pastBonuses, RArray.map(addTakeHomeForBonus));
	const futureBonuses = pipe(
		data.futureBonuses,
		RArray.map(addTakeHomeForBonus)
	);
	return produce(data, (draft) => {
		draft.pastBonuses = castDraft(pastBonuses);
		draft.futureBonuses = castDraft(futureBonuses);
	});
};
