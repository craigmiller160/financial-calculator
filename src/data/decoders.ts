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

const pastPaycheckV = ioType.intersection([basePaycheckV, rate401kV]);

const payrollTaxRatesV = Codecs.readonlyType({
	socialSecurity: ioType.number,
	medicare: ioType.number
});

const federalTaxBracketV = Codecs.readonlyType({
	rate: ioType.number,
	minimumIncome: ioType.number,
	maximumIncome: ioType.union([ioType.number, ioType.undefined])
});

const baseBonusV = Codecs.readonlyType({
	date: ioType.string,
	grossPay: ioType.number
});
const pastBonusesV = ioType.intersection([baseBonusV, rate401kV]);

export const personalDataV = Codecs.readonlyType({
	pastPaychecks: ioType.readonlyArray(pastPaycheckV),
	futurePaychecks: ioType.readonlyArray(basePaycheckV),
	pastBonuses: ioType.readonlyArray(pastBonusesV),
	futureBonuses: ioType.readonlyArray(baseBonusV)
});

export const legalDataV = Codecs.readonlyType({
	contributionLimit401k: ioType.number,
	payrollTaxRates: payrollTaxRatesV,
	federalTaxBrackets: federalTaxBracketV
});

export type BasePaycheck = ioType.TypeOf<typeof basePaycheckV>;
export type PastPaycheck = ioType.TypeOf<typeof pastPaycheckV>;
export type FuturePaycheck = ioType.TypeOf<typeof basePaycheckV>;
export type BenefitsCost = ioType.TypeOf<typeof benefitsCostV>;
export type BaseBonus = ioType.TypeOf<typeof baseBonusV>;
export type PastBonus = ioType.TypeOf<typeof pastBonusesV>;
export type FutureBonus = ioType.TypeOf<typeof baseBonusV>;
export type PersonalData = ioType.TypeOf<typeof personalDataV>;
export type PayrollTaxRates = ioType.TypeOf<typeof payrollTaxRatesV>;
export type FederalTaxBracket = ioType.TypeOf<typeof federalTaxBracketV>;
export type LegalData = ioType.TypeOf<typeof legalDataV>;
