import { PersonalDataWithTotals } from '../totals/TotalTypes';
import { LegalData } from '../../data/decoders';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import * as Option from 'fp-ts/Option';
import produce from 'immer';

export const addRothIraLimit =
	(legalData: LegalData) =>
	(personalData: PersonalDataWithTotals): PersonalDataWithTotals => {
		const limit = pipe(
			legalData.rothIraLimits,
			RArray.findFirst(
				(limit) =>
					limit.maximumIncome >
					personalData.totals.combined.estimatedMAGI
			),
			Option.fold(
				() => 0,
				(limit) => limit.contributionLimit
			)
		);
		return produce(personalData, (draft) => {
			draft.rothIraLimit = limit;
		});
	};
