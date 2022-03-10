import { Calculations401k } from './CalculationTypes';
import {
	Data,
	LegalData,
	PaycheckWith401k,
	PayrollTaxRates
} from '../data/decoders';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import { sumBenefits } from './CommonCalculations';
import Decimal from 'decimal.js';
import { findTaxBracket } from './utils/findTaxBracket';
import * as Either from 'fp-ts/Either';
import { calculateTaxes } from './utils/calculateTaxes';

const calculatePaycheckTaxableIncome = (
	paycheck: PaycheckWith401k,
	payrollTaxRates: PayrollTaxRates
): Decimal => {
	// TODO need like all of these for the new PaycheckWithTakeHome
	const grossPay = new Decimal(paycheck.grossPay);
	const totalBenefitsCost = new Decimal(sumBenefits(paycheck.benefitsCost));
	const socialSecurityTax = grossPay.times(
		new Decimal(payrollTaxRates.socialSecurity)
	);
	const medicareTax = grossPay.times(new Decimal(payrollTaxRates.medicare));
	const contribution401k = grossPay.times(new Decimal(paycheck.rate401k));
	return grossPay
		.minus(totalBenefitsCost)
		.minus(socialSecurityTax)
		.minus(medicareTax)
		.minus(contribution401k);
};

const calculateTaxRate =
	(totalYearlyIncome: Decimal) =>
	(totalYearlyTax: Decimal): Decimal =>
		totalYearlyTax.dividedBy(totalYearlyIncome);

const calculateTaxRateForPaycheck =
	(legalData: LegalData) => (paycheck: PaycheckWith401k) => {
		const paycheckTaxableIncome = calculatePaycheckTaxableIncome(
			paycheck,
			legalData.payrollTaxRates
		);
		const totalYearlyTaxableIncome = paycheckTaxableIncome.times(
			new Decimal(26)
		);
		pipe(
			findTaxBracket(
				legalData.federalTaxBrackets,
				totalYearlyTaxableIncome
			),
			Either.map(calculateTaxes(totalYearlyTaxableIncome)),
			Either.map(calculateTaxRate(totalYearlyTaxableIncome))
		);
	};

export const calculateTaxesForPaychecks = (
	data: Data,
	calculations401k: Calculations401k // TODO might just need future rate
) => {
	pipe(
		data.personalData.pastPaychecks,
		RArray.map(calculateTaxRateForPaycheck(data.legalData))
	);

	throw new Error();
};
