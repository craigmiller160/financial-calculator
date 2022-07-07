import { DataWithTotals, PersonalDataWithTotals } from '../totals/TotalTypes';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import * as Option from 'fp-ts/Option';
import produce from 'immer';

export const addRothIraLimit = (
	data: DataWithTotals
): PersonalDataWithTotals => {
	const limit = pipe(
		data.legalData.rothIraLimits,
		RArray.findFirst(
			(limit) =>
				limit.maximumIncome >
				data.personalData.totals.combinedWithAdditionalIncome
					.estimatedMAGI
		),
		Option.fold(
			() => 0,
			(limit) => limit.contributionLimit
		)
	);
	return produce(data.personalData, (draft) => {
		draft.rothIraLimit = limit;
	});
};
