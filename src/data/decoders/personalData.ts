import * as Codecs from '@craigmiller160/ts-functions/Codecs';
import * as ioType from 'io-ts';

const benefitsCostCodec = Codecs.readonlyType({
	dental: ioType.number,
	hsa: ioType.number,
	fsa: ioType.number,
	medical: ioType.number,
	vision: ioType.number
});

const rates401kCodec = Codecs.readonlyType({
	employeeRate: ioType.union([ioType.number, ioType.undefined]),
	employerRate: ioType.number
});

export const paycheckCodec = Codecs.readonlyType({
	name: ioType.string,
	startDate: ioType.string,
	endDate: ioType.string,
	benefitsCost: benefitsCostCodec,
	numberOfChecks: ioType.number,
	grossPay: ioType.number,
	rates401k: rates401kCodec
});

export const bonusCodec = Codecs.readonlyType({
	name: ioType.string,
	date: ioType.string,
	grossPay: ioType.number,
	rates401k: rates401kCodec
});

export type BenefitsCost = ioType.TypeOf<typeof benefitsCostCodec>;
export type Rates401k = ioType.TypeOf<typeof rates401kCodec>;
export type Paycheck = ioType.TypeOf<typeof paycheckCodec>;
export type Bonus = ioType.TypeOf<typeof bonusCodec>;
