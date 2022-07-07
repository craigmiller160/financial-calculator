import * as Codecs from '@craigmiller160/ts-functions/Codecs';
import * as ioType from 'io-ts';

const rothIraLimitCodec = Codecs.readonlyType({
	maximumIncome: ioType.number,
	contributionLimit: ioType.number
});

const payrollTaxRatesCodec = Codecs.readonlyType({
	socialSecurity: ioType.number,
	medicare: ioType.number
});

const federalTaxBracketCodec = Codecs.readonlyType({
	rate: ioType.number,
	minimumIncome: ioType.number,
	maximumIncome: ioType.number,
	baseAmountOwed: ioType.number
});

export const legalDataCodec = Codecs.readonlyType({
	contributionLimit401k: ioType.number,
	payrollTaxRates: payrollTaxRatesCodec,
	rothIraLimits: ioType.readonlyArray(rothIraLimitCodec),
	federalTaxBrackets: ioType.readonlyArray(federalTaxBracketCodec)
});

export type RothIraLimit = ioType.TypeOf<typeof rothIraLimitCodec>;
export type PayrollTaxRates = ioType.TypeOf<typeof payrollTaxRatesCodec>;
export type FederalTaxBracket = ioType.TypeOf<typeof federalTaxBracketCodec>;
export type LegalData = ioType.TypeOf<typeof legalDataCodec>;
