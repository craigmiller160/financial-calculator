import * as ioType from 'io-ts';
import * as Codecs from '@craigmiller160/ts-functions/Codecs';

const basePaycheckV = Codecs.readonlyType({
	benefitsCost: Codecs.readonlyType({
		dental: ioType.number,
		hsa: ioType.number,
		medical: ioType.number,
		vision: ioType.number
	}),
	numberOfChecks: ioType.number,
	grossPay: ioType.number
});

const rate401kV = Codecs.readonlyType({
	rate401k: ioType.number
});

const pastPaycheckV = ioType.intersection([basePaycheckV, rate401kV]);

const staticTaxRatesV = Codecs.readonlyType({
	socialSecurity: ioType.number,
	medicare: ioType.number
});

const baseBonusV = Codecs.readonlyType({
	grossPay: ioType.number
});
const pastBonusesV = ioType.intersection([baseBonusV, rate401kV]);

export const dataV = Codecs.readonlyType({
	pastPaychecks: ioType.readonlyArray(pastPaycheckV),
	futurePaychecks: ioType.readonlyArray(basePaycheckV),
	pastBonuses: ioType.readonlyArray(pastBonusesV),
	futureBonuses: ioType.readonlyArray(baseBonusV),
	staticTaxRates: staticTaxRatesV
});

export type PastPaycheck = ioType.TypeOf<typeof pastPaycheckV>;
export type FuturePaycheck = ioType.TypeOf<typeof basePaycheckV>;
export type StaticTaxRates = ioType.TypeOf<typeof staticTaxRatesV>;
export type PastBonus = ioType.TypeOf<typeof pastBonusesV>;
export type FutureBonus = ioType.TypeOf<typeof baseBonusV>;
export type Data = ioType.TypeOf<typeof dataV>;
