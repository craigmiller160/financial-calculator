import { Data } from '../../data/decoders';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import { addTotalsToPaycheck } from './addTotalsToPaychecks';
import { addTotalsToBonus } from './addTotalsToBonus';
import { PersonalDataWithTotals } from './TotalTypes';

export const addTotalsToData = (data: Data): PersonalDataWithTotals => {
	const pastPaychecks = pipe(
		data.personalData.pastPaychecks,
		RArray.map(addTotalsToPaycheck(data.legalData))
	);
	const pastBonuses = pipe(
		data.personalData.pastBonuses,
		RArray.map(addTotalsToBonus(data.legalData))
	);

	const futurePaychecks = pipe(
		data.personalData.futurePaychecks,
		RArray.map(addTotalsToPaycheck(data.legalData))
	);

	const futureBonuses = pipe(
		data.personalData.futureBonuses,
		RArray.map(addTotalsToBonus(data.legalData))
	);
	return {
		pastPaychecks,
		pastBonuses,
		futurePaychecks,
		futureBonuses,
		totals: {
			pastGrossPay: 0,
			pastContribution401k: 0,
			pastEstimatedAGI: 0,
			pastEstimatedMAGI: 0,
			futureGrossPay: 0,
			futureContribution401k: 0,
			futureEstimatedAGI: 0,
			futureEstimatedMAGI: 0,
			pastTakeHomePay: 0,
			futureTakeHomePay: 0
		},
		futureRate401k: 0
	};
};
