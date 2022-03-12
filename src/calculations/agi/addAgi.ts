import {
	AdditionalIncomeWithTotals,
	BonusWithTotal,
	PaycheckWithTotal,
	PersonalDataWithTotals
} from '../totals/TotalTypes';
import produce, { castDraft } from 'immer';
import { annualizePayPeriodValue } from '../utils/annualizePayPeriodValue';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import { totalValueForChecks } from '../utils/totalValueForChecks';

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

const getAdditionalIncomeAgi = (
	additionalIncome: AdditionalIncomeWithTotals
): number => additionalIncome.total.grossPay;

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
		draft.additionalIncome.total.estimatedAGI = getAdditionalIncomeAgi(
			draft.additionalIncome
		);
	});
};
