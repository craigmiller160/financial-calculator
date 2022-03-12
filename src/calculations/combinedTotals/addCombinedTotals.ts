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
		const past = {
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
		};
		const future = {
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
		};
		const combined = {
			grossPay: decimalAdd(past.grossPay, future.grossPay),
			contribution401k: decimalAdd(
				past.contribution401k,
				future.contribution401k
			),
			estimatedAGI: decimalAdd(past.estimatedAGI, future.estimatedAGI),
			estimatedMAGI: decimalAdd(past.estimatedMAGI, future.estimatedMAGI),
			estimatedTakeHomePay: decimalAdd(
				past.estimatedTakeHomePay,
				future.estimatedTakeHomePay
			)
		};
		draft.totals = {
			past,
			future,
			combined,
			combinedWithAdditionalIncome: {
				estimatedAGI: decimalAdd(
					combined.estimatedAGI,
					draft.additionalIncome.total.estimatedAGI
				),
				estimatedMAGI: decimalAdd(
					combined.estimatedMAGI,
					draft.additionalIncome.total.estimatedMAGI
				),
				// TODO do I want this here? It seems to confuse things
				estimatedTakeHomePay: combined.estimatedTakeHomePay
			}
		};
	});
};
