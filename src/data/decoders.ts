import * as Codecs from '@craigmiller160/ts-functions/Codecs';
import * as ioType from 'io-ts';

const benefitsCostV = Codecs.readonlyType({
	dental: ioType.number,
	hsa: ioType.number,
	fsa: ioType.number,
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