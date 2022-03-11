// TODO integrate MAGI

import {
	getCombinedTotalsForBonuses,
	getCombinedTotalsForPaychecks
} from './getCombinedTotals';
import { PersonalDataWithTotals } from '../totals/TotalTypes';
import produce from 'immer';

export const addCombinedTotals = (
	data: PersonalDataWithTotals
): PersonalDataWithTotals => {
	const pastPaychecksTotal = getCombinedTotalsForPaychecks(
		data.pastPaychecks
	);
	const pastBonusesTotal = getCombinedTotalsForBonuses(data.pastBonuses);
	const futurePaychecksTotal = getCombinedTotalsForPaychecks(
		data.futurePaychecks
	);
	const futureBonusesTotal = getCombinedTotalsForBonuses(data.futureBonuses);
	return produce(data, (draft) => {
		draft.totals = {
			pastGrossPay:
				pastPaychecksTotal.grossPay + pastBonusesTotal.grossPay,
			pastContribution401k:
				pastPaychecksTotal.contribution401k +
				pastBonusesTotal.contribution401k,
			pastEstimatedAGI:
				pastPaychecksTotal.estimatedAGI + pastBonusesTotal.estimatedAGI,
			pastEstimatedMAGI:
				pastPaychecksTotal.estimatedMAGI +
				pastBonusesTotal.estimatedMAGI,
			futureGrossPay:
				futurePaychecksTotal.grossPay + futureBonusesTotal.grossPay,
			futureContribution401k:
				futurePaychecksTotal.contribution401k +
				futureBonusesTotal.contribution401k,
			futureEstimatedAGI:
				futurePaychecksTotal.estimatedAGI +
				futureBonusesTotal.estimatedAGI,
			futureEstimatedMAGI:
				futurePaychecksTotal.estimatedMAGI +
				futureBonusesTotal.estimatedMAGI,
			pastTakeHomePay: 0, // TODO just add this here
			futureTakeHomePay: 0 // TODO just add this here
		};
	});
};
