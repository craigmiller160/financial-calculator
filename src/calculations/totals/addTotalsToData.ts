import { Data } from '../../data/decoders';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import { addTotalsToPaycheck } from './addTotalsToPaychecks';
import { addTotalsToBonus } from './addTotalsToBonus';
import {
	getCombinedTotalsForBonuses,
	getCombinedTotalsForPaychecks
} from './getCombinedTotals';
import { PersonalDataWithTotals } from './TotalTypes';

export const addTotalsToData = (data: Data): PersonalDataWithTotals => {
	const pastPaychecks = pipe(
		data.personalData.pastPaychecks,
		RArray.map(addTotalsToPaycheck(data.legalData))
	);
	const pastPaychecksTotal = getCombinedTotalsForPaychecks(pastPaychecks);
	const pastBonuses = pipe(
		data.personalData.pastBonuses,
		RArray.map(addTotalsToBonus(data.legalData))
	);
	const pastBonusesTotal = getCombinedTotalsForBonuses(pastBonuses);

	const futurePaychecks = pipe(
		data.personalData.futurePaychecks,
		RArray.map(addTotalsToPaycheck(data.legalData))
	);
	const futurePaychecksTotal = getCombinedTotalsForPaychecks(futurePaychecks);
	const futureBonuses = pipe(
		data.personalData.futureBonuses,
		RArray.map(addTotalsToBonus(data.legalData))
	);
	const futureBonusesTotal = getCombinedTotalsForBonuses(futureBonuses);
	return {
		pastPaychecks,
		pastBonuses,
		futurePaychecks,
		futureBonuses,
		totals: {
			pastGrossPay:
				pastPaychecksTotal.grossPay + pastBonusesTotal.grossPay,
			pastContribution401k:
				pastPaychecksTotal.contribution401k +
				pastBonusesTotal.contribution401k,
			pastEstimatedAGI:
				pastPaychecksTotal.estimatedAGI + pastBonusesTotal.estimatedAGI,
			futureGrossPay:
				futurePaychecksTotal.grossPay + futureBonusesTotal.grossPay,
			futureContribution401k: 0,
			futureEstimatedAGI:
				futurePaychecksTotal.estimatedAGI +
				futureBonusesTotal.estimatedAGI,
			pastTakeHomePay: 0,
			futureTakeHomePay: 0
		},
		futureRate401k: 0
	};
};
