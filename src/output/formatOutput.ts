import {
	BonusWithTotal,
	PaycheckWithTotal,
	PersonalDataWithTotals
} from '../calculations/totals/TotalTypes';
import { MonoidT } from '@craigmiller160/ts-functions/types';
import * as Monoid from 'fp-ts/Monoid';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import Decimal from 'decimal.js';

const newlineMonoid: MonoidT<string> = {
	empty: '',
	concat: (a, b) => {
		if (a.length === 0) {
			return b;
		}
		return `${a}\n\t\t${b}`;
	}
};
const decimalSumMonoid: MonoidT<Decimal> = {
	empty: new Decimal(0),
	concat: (a, b) => a.plus(b)
};

const CURRENCY_FORMAT = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD'
});
const PERCENT_FORMAT = new Intl.NumberFormat('en-US', {
	style: 'percent',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});
const COL_LENGTH = 15;

const formatPercent = (num: number): string => PERCENT_FORMAT.format(num);
const formatCurrency = (num: number): string => CURRENCY_FORMAT.format(num);
const pad = (text: string): string => ` ${text.padEnd(COL_LENGTH, ' ')}`;

const PAYCHECK_HEADER = `|${pad('Start')}|${pad('End')}|${pad(
	'# of Checks'
)}|${pad('Gross Pay')}|${pad('401k Rate')}|${pad('401k Amount')}|${pad(
	'HSA Amount'
)}|${pad('Take Home')}|${pad('Full Income')}|`;

const BONUS_HEADER = `|${pad('Date')}|${pad('Gross Pay')}|${pad(
	'401k Rate'
)}|${pad('401k Amount')}|${pad('Take Home')}|${pad('Full Income')}|`;

const TOTAL_HEADER = `|${pad('Gross Pay')}|${pad('AGI/MAGI')}|${pad(
	'Add. Income'
)}|${pad('401k Amount')}|${pad('HSA Amount')}|${pad('Take Home')}|${pad(
	'Full Income'
)}|`;

const sum = (values: ReadonlyArray<number>): number =>
	pipe(
		values,
		RArray.map((_) => new Decimal(_)),
		Monoid.concatAll(decimalSumMonoid)
	).toNumber();

const formatPaycheck = (paycheck: PaycheckWithTotal): string => {
	const startDate = pad(paycheck.startDate);
	const endDate = pad(paycheck.endDate);
	const numChecks = pad(paycheck.numberOfChecks.toString());
	const grossPay = pipe(paycheck.grossPay, formatCurrency, pad);
	const rate401k = pipe(paycheck.paycheck401k.rate, formatPercent, pad);
	const amount401k = pipe(paycheck.paycheck401k.amount, formatCurrency, pad);
	const amountHsa = pipe(paycheck.benefitsCost.hsa, formatCurrency, pad);
	const takeHome = pipe(paycheck.estimatedTakeHomePay, formatCurrency, pad);
	const fullIncome = pipe(
		[
			paycheck.paycheck401k.amount,
			paycheck.estimatedTakeHomePay,
			paycheck.benefitsCost.hsa
		],
		sum,
		formatCurrency,
		pad
	);
	return `|${startDate}|${endDate}|${numChecks}|${grossPay}|${rate401k}|${amount401k}|${amountHsa}|${takeHome}|${fullIncome}|`;
};

const formatAllPaychecks = (
	paychecks: ReadonlyArray<PaycheckWithTotal>
): string =>
	pipe(
		paychecks,
		RArray.map(formatPaycheck),
		Monoid.concatAll(newlineMonoid)
	);

const formatBonus = (bonus: BonusWithTotal): string => {
	const date = pad(bonus.date);
	const grossPay = pipe(bonus.grossPay, formatCurrency, pad);
	const rate401k = pipe(bonus.bonus401k.rate, formatPercent, pad);
	const amount401k = pipe(bonus.bonus401k.amount, formatCurrency, pad);
	const takeHome = pipe(bonus.estimatedTakeHomePay, formatCurrency, pad);
	const fullIncome = pipe(
		[bonus.bonus401k.amount, bonus.estimatedTakeHomePay],
		sum,
		formatCurrency,
		pad
	);
	return `|${date}|${grossPay}|${rate401k}|${amount401k}|${takeHome}|${fullIncome}|`;
};

const formatAllBonuses = (bonuses: ReadonlyArray<BonusWithTotal>): string =>
	pipe(bonuses, RArray.map(formatBonus), Monoid.concatAll(newlineMonoid));

const formatTotals = (data: PersonalDataWithTotals): string => {
	const grossPay = pad(
		formatCurrency(data.totals.combinedWithAdditionalIncome.grossPay)
	);
	const agiMagi = pad(
		formatCurrency(data.totals.combinedWithAdditionalIncome.estimatedAGI)
	);
	const amount401k = pad(
		formatCurrency(
			data.totals.combinedWithAdditionalIncome.contribution401k
		)
	);
	const takeHome = pad(
		formatCurrency(
			data.totals.combinedWithAdditionalIncome.estimatedTakeHomePay
		)
	);
	const addIncome = pad(formatCurrency(data.additionalIncome.total.grossPay));
	const fullIncome = pad(
		formatCurrency(
			sum([
				data.totals.combinedWithAdditionalIncome.estimatedTakeHomePay,
				data.totals.combinedWithAdditionalIncome.contribution401k,
				data.totals.combinedWithAdditionalIncome.contributionHsa,
				data.additionalIncome.total.grossPay
			])
		)
	);
	const amountHsa = pad(
		formatCurrency(data.totals.combinedWithAdditionalIncome.contributionHsa)
	);
	return `|${grossPay}|${agiMagi}|${addIncome}|${amount401k}|${amountHsa}|${takeHome}|${fullIncome}|`;
};

export const formatOutput = (data: PersonalDataWithTotals): string => {
	const percent401k = formatPercent(data.futureRate401k);
	const rothIraLimit = formatCurrency(data.rothIraLimit);
	return `
	PAYCHECKS
		${PAYCHECK_HEADER}
		${formatAllPaychecks(data.pastPaychecks)}
		${formatAllPaychecks(data.futurePaychecks)}
	
	BONUSES
		${BONUS_HEADER}
		${formatAllBonuses(data.pastBonuses)}
		${formatAllBonuses(data.futureBonuses)}
	
	TOTALS
		${TOTAL_HEADER}
		${formatTotals(data)}
	
	NEW TARGETS
		New 401k Contribution Rate: ${percent401k}
		This Year's Roth IRA Limit: ${rothIraLimit}  
	`;
};
