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
			pastGrossPay: decimalAdd(
				pastPaychecksTotal.grossPay,
				pastBonusesTotal.grossPay
			),
			pastContribution401k: decimalAdd(
				pastPaychecksTotal.contribution401k,
				pastBonusesTotal.contribution401k
			),
			pastEstimatedAGI: decimalAdd(
				pastPaychecksTotal.estimatedAGI,
				pastBonusesTotal.estimatedAGI
			),
			pastEstimatedMAGI: decimalAdd(
				pastPaychecksTotal.estimatedMAGI,
				pastBonusesTotal.estimatedMAGI
			),
			futureGrossPay: decimalAdd(
				futurePaychecksTotal.grossPay,
				futureBonusesTotal.grossPay
			),
			futureContribution401k: decimalAdd(
				futurePaychecksTotal.contribution401k,
				futureBonusesTotal.contribution401k
			),
			futureEstimatedAGI: decimalAdd(
				futurePaychecksTotal.estimatedAGI,
				futureBonusesTotal.estimatedAGI
			),
			futureEstimatedMAGI: decimalAdd(
				futurePaychecksTotal.estimatedMAGI,
				futureBonusesTotal.estimatedMAGI
			),
			pastEstimatedTakeHomePay: decimalAdd(
				pastPaychecksTotal.estimatedTakeHomePay,
				pastBonusesTotal.estimatedTakeHomePay
			),
			futureEstimatedTakeHomePay: decimalAdd(
				futurePaychecksTotal.estimatedTakeHomePay,
				futureBonusesTotal.estimatedTakeHomePay
			)
		};
	});
};
