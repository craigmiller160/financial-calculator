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
		return `${a}\n${b}`;
	}
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
	'Gross Pay'
)}|${pad('401k Rate')}|${pad('401k Amount')}|${pad('Take Home')}|${pad(
	'Full Income'
)}|`;

const BONUS_HEADER = `|${pad('Date')}|${pad('Gross Pay')}|${pad(
	'401k Rate'
)}|${pad('401k Amount')}|${pad('Take Home')}|${pad('Full Income')}|`;

const TOTAL_HEADER = `|${pad('Gross Pay')}|${pad('AGI/MAGI')}|${pad(
	'401k Amount'
)}|${pad('Take Home')}|${pad('Full Income')}|`;

const sum = (num1: number, num2: number): number =>
	new Decimal(num1).plus(new Decimal(num2)).toNumber();

const formatPaycheck = (paycheck: PaycheckWithTotal): string => {
	const startDate = pad(paycheck.startDate);
	const endDate = pad(paycheck.endDate);
	const grossPay = pad(formatCurrency(paycheck.grossPay));
	const rate401k = pad(formatPercent(paycheck.paycheck401k.rate));
	const amount401k = pad(formatCurrency(paycheck.paycheck401k.amount));
	const takeHome = pad(formatCurrency(paycheck.estimatedTakeHomePay));
	const fullIncome = pad(
		formatCurrency(
			sum(paycheck.paycheck401k.amount, paycheck.estimatedTakeHomePay)
		)
	);
	return `|${startDate}|${endDate}|${grossPay}|${rate401k}|${amount401k}|${takeHome}|${fullIncome}|`;
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
	const grossPay = pad(formatCurrency(bonus.grossPay));
	const rate401k = pad(formatPercent(bonus.bonus401k.rate));
	const amount401k = pad(formatCurrency(bonus.bonus401k.amount));
	const takeHome = pad(formatCurrency(bonus.estimatedTakeHomePay));
	const fullIncome = pad(
		formatCurrency(sum(bonus.bonus401k.amount, bonus.estimatedTakeHomePay))
	);
	return `|${date}|${grossPay}|${rate401k}|${amount401k}|${takeHome}|${fullIncome}|`;
};

const formatAllBonuses = (bonuses: ReadonlyArray<BonusWithTotal>): string =>
	pipe(bonuses, RArray.map(formatBonus), Monoid.concatAll(newlineMonoid));

// TODO add investment income as column and include in full income
const formatTotals = (data: PersonalDataWithTotals): string => {
	const grossPay = pad(formatCurrency(data.totals.combined.grossPay));
	const agiMagi = pad(formatCurrency(data.totals.combined.estimatedAGI));
	const amount401k = pad(
		formatCurrency(data.totals.combined.contribution401k)
	);
	const takeHome = pad(
		formatCurrency(data.totals.combined.estimatedTakeHomePay)
	);
	const fullIncome = pad(
		formatCurrency(
			sum(
				data.totals.combined.estimatedTakeHomePay,
				data.totals.combined.contribution401k
			)
		)
	);
	return `|${grossPay}|${agiMagi}|${amount401k}|${takeHome}|${fullIncome}|`;
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