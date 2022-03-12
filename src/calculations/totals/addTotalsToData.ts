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
			past: {
				contributionHsa: 0,
				grossPay: 0,
				contribution401k: 0,
				estimatedAGI: 0,
				estimatedMAGI: 0,
				estimatedTakeHomePay: 0
			},
			future: {
				contributionHsa: 0,
				grossPay: 0,
				contribution401k: 0,
				estimatedAGI: 0,
				estimatedMAGI: 0,
				estimatedTakeHomePay: 0
			},
			combined: {
				contributionHsa: 0,
				grossPay: 0,
				contribution401k: 0,
				estimatedAGI: 0,
				estimatedMAGI: 0,
				estimatedTakeHomePay: 0
			},
			combinedWithAdditionalIncome: {
				contributionHsa: 0,
				grossPay: 0,
				contribution401k: 0,
				estimatedAGI: 0,
				estimatedMAGI: 0,
				estimatedTakeHomePay: 0
			}
		},
		futureRate401k: 0,
		rothIraLimit: 0,
		additionalIncome: {
			taxableInvestmentIncome:
				data.personalData.additionalIncome.taxableInvestmentIncome,
			total: {
				grossPay:
					data.personalData.additionalIncome.taxableInvestmentIncome,
				estimatedAGI: 0,
				estimatedMAGI: 0
			}
		}
	};
};
