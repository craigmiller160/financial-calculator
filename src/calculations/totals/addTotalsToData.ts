import { Data } from '../../data/decoders';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import { addTotalsToPaycheck } from './addTotalsToPaychecks';
import { addTotalsToBonus } from './addTotalsToBonus';

export const addTotalsToData = (data: Data) => {
	const pastPaychecks = pipe(
		data.personalData.pastPaychecks,
		RArray.map(addTotalsToPaycheck(data.legalData))
	);
	// TODO sum all paychecks
	const pastBonuses = pipe(
		data.personalData.pastBonuses,
		RArray.map(addTotalsToBonus(data.legalData))
	);
	// TODO sum all bonuses

	const futurePaychecks = pipe(
		data.personalData.futurePaychecks,
		RArray.map(addTotalsToPaycheck(data.legalData))
	);
	// TODO sum all paychecks
	const futureBonuses = pipe(
		data.personalData.futureBonuses,
		RArray.map(addTotalsToBonus(data.legalData))
	);
	// TODO sum all bonuses
};
