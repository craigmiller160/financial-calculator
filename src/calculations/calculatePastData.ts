import { BasePaycheck, BenefitsCost, Data } from '../data/decoders';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import * as Monoid from 'fp-ts/Monoid';
import { PerPaycheckBenefitsCost } from './CalculationTypes';
import { totalBenefitsCostPerPaycheckMonoid } from './CalculationMonoids';

const getTotalBenefitsCostPerPaycheck = (
	paychecks: ReadonlyArray<BasePaycheck>
): BenefitsCost =>
	pipe(
		paychecks,
		RArray.map(
			(_): PerPaycheckBenefitsCost => ({
				..._.benefitsCost,
				numberOfChecks: _.numberOfChecks
			})
		),
		Monoid.concatAll(totalBenefitsCostPerPaycheckMonoid)
	);

export const calculatePastData = (data: Data) => {
	const totalBenefitsPerPaycheck = getTotalBenefitsCostPerPaycheck(
		data.pastPaychecks
	);
};
