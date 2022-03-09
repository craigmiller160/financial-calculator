import ioType, { Props } from 'io-ts';

// TODO move to lib
const readonlyType = <P extends Props>(
	props: P
): ioType.ReadonlyC<ioType.TypeC<P>> => ioType.readonly(ioType.type(props));

const basePaycheckV = readonlyType({
	benefitsCost: readonlyType({
		dental: ioType.number,
		hsa: ioType.number,
		medical: ioType.number,
		vision: ioType.number
	}),
	numberOfChecks: ioType.number,
	grossPay: ioType.number
});

const rate401kV = readonlyType({
	rate401k: ioType.number
});

const pastPaycheckV = ioType.intersection([basePaycheckV, rate401kV]);

const staticTaxRatesV = readonlyType({
	socialSecurity: ioType.number,
	medicare: ioType.number
});

const baseBonusV = readonlyType({
	grossPay: ioType.number
});
const pastBonusesV = ioType.intersection([baseBonusV, rate401kV]);

export const dataV = readonlyType({
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
