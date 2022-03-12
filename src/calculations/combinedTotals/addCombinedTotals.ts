import {
	getCombinedTotalsForBonuses,
	getCombinedTotalsForPaychecks
} from './getCombinedTotals';
import { PersonalDataWithTotals } from '../totals/TotalTypes';
import produce from 'immer';
import Decimal from 'decimal.js';

const decimalAdd = (a: number, b: number): number =>
	new Decimal(a).plus(new Decimal(b)).toNumber();

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
			past: {
				grossPay: decimalAdd(
					pastPaychecksTotal.grossPay,
					pastBonusesTotal.grossPay
				),
				contribution401k: decimalAdd(
					pastPaychecksTotal.contribution401k,
					pastBonusesTotal.contribution401k
				),
				estimatedAGI: decimalAdd(
					pastPaychecksTotal.estimatedAGI,
					pastBonusesTotal.estimatedAGI
				),
				estimatedMAGI: decimalAdd(
					pastPaychecksTotal.estimatedMAGI,
					pastBonusesTotal.estimatedMAGI
				),
				estimatedTakeHomePay: decimalAdd(
					pastPaychecksTotal.estimatedTakeHomePay,
					pastBonusesTotal.estimatedTakeHomePay
				)
			},
			future: {
				grossPay: decimalAdd(
					futurePaychecksTotal.grossPay,
					futureBonusesTotal.grossPay
				),
				contribution401k: decimalAdd(
					futurePaychecksTotal.contribution401k,
					futureBonusesTotal.contribution401k
				),
				estimatedAGI: decimalAdd(
					futurePaychecksTotal.estimatedAGI,
					futureBonusesTotal.estimatedAGI
				),
				estimatedMAGI: decimalAdd(
					futurePaychecksTotal.estimatedMAGI,
					futureBonusesTotal.estimatedMAGI
				),
				estimatedTakeHomePay: decimalAdd(
					futurePaychecksTotal.estimatedTakeHomePay,
					futureBonusesTotal.estimatedTakeHomePay
				)
			},
			combined: {
				// TODO fix this
				grossPay: 0,
				contribution401k: 0,
				estimatedAGI: 0,
				estimatedMAGI: 0,
				estimatedTakeHomePay: 0
			}
		};
	});
};
