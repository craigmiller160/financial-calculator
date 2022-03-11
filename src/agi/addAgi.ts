import {
	BonusWithTotal,
	PaycheckWithTotal,
	PersonalDataWithTotals
} from '../calculations/totals/TotalTypes';
import produce, { castDraft } from 'immer';
import { annualizePayPeriodValue } from '../calculations/utils/annualizePayPeriodValue';
import Decimal from 'decimal.js';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';

const totalValueForChecks = (value: number, numChecks: number): number =>
	new Decimal(value).times(new Decimal(numChecks)).toNumber();

const addAgiToPaycheck = (paycheck: PaycheckWithTotal): PaycheckWithTotal => {
	const agi =
		paycheck.grossPay -
		paycheck.benefitsCost.total -
		paycheck.payrollTaxCost.total -
		paycheck.paycheck401k.amount;
	const annualizedAgi = annualizePayPeriodValue(agi);
	const totalForChecksAgi = totalValueForChecks(agi, paycheck.numberOfChecks);
	return produce(paycheck, (draft) => {
		draft.estimatedAGI = agi;
		draft.totalsForAllChecks.estimatedAGI = totalForChecksAgi;
		draft.annualized.estimatedAGI = annualizedAgi;
	});
};

const addAgiToBonus = (bonus: BonusWithTotal): BonusWithTotal => {
	const agi =
		bonus.grossPay - bonus.payrollTaxCosts.total - bonus.bonus401k.amount;
	return produce(bonus, (draft) => {
		draft.estimatedAGI = agi;
	});
};

export const addAgi = (
	personalData: PersonalDataWithTotals
): PersonalDataWithTotals => {
	const pastPaychecks = pipe(
		personalData.pastPaychecks,
		RArray.map(addAgiToPaycheck)
	);
	const futurePaychecks = pipe(
		personalData.futurePaychecks,
		RArray.map(addAgiToPaycheck)
	);
	const pastBonuses = pipe(
		personalData.pastBonuses,
		RArray.map(addAgiToBonus)
	);
	const futureBonuses = pipe(
		personalData.futureBonuses,
		RArray.map(addAgiToBonus)
	);
	return produce(personalData, (draft) => {
		draft.pastPaychecks = castDraft(pastPaychecks);
		draft.futurePaychecks = castDraft(futurePaychecks);
		draft.pastBonuses = castDraft(pastBonuses);
		draft.futureBonuses = castDraft(futureBonuses);
	});
};
