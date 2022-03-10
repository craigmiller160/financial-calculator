import * as ioType from 'io-ts';
import * as Codecs from '@craigmiller160/ts-functions/Codecs';

const benefitsCostV = Codecs.readonlyType({
	dental: ioType.number,
	hsa: ioType.number,
	medical: ioType.number,
	vision: ioType.number
});

const basePaycheckV = Codecs.readonlyType({
	startDate: ioType.string,
	endDate: ioType.string,
	benefitsCost: benefitsCostV,
	numberOfChecks: ioType.number,
	grossPay: ioType.number
});

const rate401kV = Codecs.readonlyType({
	rate401k: ioType.number
});

const paycheckWith401kV = ioType.intersection([basePaycheckV, rate401kV]);

const payrollTaxRatesV = Codecs.readonlyType({
	socialSecurity: ioType.number,
	medicare: ioType.number
});

const federalTaxBracketV = Codecs.readonlyType({
	rate: ioType.number,
	minimumIncome: ioType.number,
	maximumIncome: ioType.union([ioType.number, ioType.undefined]),
	baseAmountOwed: ioType.number
});

const baseBonusV = Codecs.readonlyType({
	date: ioType.string,
	grossPay: ioType.number
});
const bonusWith401kV = ioType.intersection([baseBonusV, rate401kV]);

export const personalDataV = Codecs.readonlyType({
	pastPaychecks: ioType.readonlyArray(paycheckWith401kV),
	futurePaychecks: ioType.readonlyArray(basePaycheckV),
	pastBonuses: ioType.readonlyArray(bonusWith401kV),
	futureBonuses: ioType.readonlyArray(baseBonusV)
});

export const legalDataV = Codecs.readonlyType({
	contributionLimit401k: ioType.number,
	payrollTaxRates: payrollTaxRatesV,
	federalTaxBrackets: ioType.readonlyArray(federalTaxBracketV)
});

export type BasePaycheck = ioType.TypeOf<typeof basePaycheckV>;
export type PaycheckWith401k = ioType.TypeOf<typeof paycheckWith401kV>;
export type BenefitsCost = ioType.TypeOf<typeof benefitsCostV>;
export type BaseBonus = ioType.TypeOf<typeof baseBonusV>;
export type BonusWith401k = ioType.TypeOf<typeof bonusWith401kV>;
export type PersonalData = ioType.TypeOf<typeof personalDataV>;
export type PayrollTaxRates = ioType.TypeOf<typeof payrollTaxRatesV>;
export type FederalTaxBracket = ioType.TypeOf<typeof federalTaxBracketV>;
export type LegalData = ioType.TypeOf<typeof legalDataV>;
export interface Data {
	readonly personalData: PersonalData;
	readonly legalData: LegalData;
}
