import {
	BonusWithTotal,
	PaycheckWithTotal,
	PersonalDataWithTotals
} from '../calculations/totals/TotalTypes';
import produce, { castDraft } from 'immer';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';

const addMagiToPaycheck = (paycheck: PaycheckWithTotal): PaycheckWithTotal =>
	produce(paycheck, (draft) => {
		draft.estimatedMAGI = draft.estimatedAGI;
		draft.totalsForAllChecks.estimatedMAGI =
			draft.totalsForAllChecks.estimatedAGI;
		draft.annualized.estimatedMAGI = draft.annualized.estimatedAGI;
	});

const addMagiToBonus = (bonus: BonusWithTotal): BonusWithTotal =>
	produce(bonus, (draft) => {
		draft.estimatedMAGI = draft.estimatedAGI;
	});

export const addMagi = (
	data: PersonalDataWithTotals
): PersonalDataWithTotals => {
	const pastPaychecks = pipe(
		data.pastPaychecks,
		RArray.map(addMagiToPaycheck)
	);
	const futurePaychecks = pipe(
		data.futurePaychecks,
		RArray.map(addMagiToPaycheck)
	);
	const pastBonuses = pipe(data.pastBonuses, RArray.map(addMagiToBonus));
	const futureBonuses = pipe(data.futureBonuses, RArray.map(addMagiToBonus));

	return produce(data, (draft) => {
		draft.pastPaychecks = castDraft(pastPaychecks);
		draft.pastBonuses = castDraft(pastBonuses);
		draft.futurePaychecks = castDraft(futurePaychecks);
		draft.futureBonuses = castDraft(futureBonuses);
	});
};
