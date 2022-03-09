import ioType, { Props } from 'io-ts';

// TODO move to lib
const readonlyType = <P extends Props>(props: P): ioType.ReadonlyC<ioType.TypeC<P>> =>
    ioType.readonly(ioType.type(props))

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

const paycheckWithRateV = readonlyType({
    rate401k: ioType.number
});

const pastPaycheckV = ioType.intersection([basePaycheckV, paycheckWithRateV]);

const staticTaxRatesV = readonlyType({
    socialSecurity: ioType.number,
    medicare: ioType.number
});

const dataV = readonlyType({
    pastPaychecks: ioType.readonlyArray(pastPaycheckV),
    futurePaychecks: ioType.readonlyArray(basePaycheckV)
})

type PastPaycheck = ioType.TypeOf<typeof pastPaycheckV>;
type FuturePaycheck = ioType.TypeOf<typeof basePaycheckV>;
type StaticTaxRates = ioType.TypeOf<typeof staticTaxRatesV>;
