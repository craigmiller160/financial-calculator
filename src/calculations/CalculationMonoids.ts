import { MonoidT } from '@craigmiller160/ts-functions/types';
import { PerPaycheckBenefitsCost, PerPaycheckIncome } from './CalculationTypes';

export const totalBenefitsCostPerPaycheckMonoid: MonoidT<PerPaycheckBenefitsCost> =
	{
		empty: {
			dental: 0,
			hsa: 0,
			medical: 0,
			vision: 0,
			numberOfChecks: 0
		},
		concat: (a, b): PerPaycheckBenefitsCost => ({
			dental: a.dental + b.dental * b.numberOfChecks,
			hsa: a.hsa + b.hsa * b.numberOfChecks,
			medical: a.medical + b.medical * b.numberOfChecks,
			vision: a.vision + b.vision * b.numberOfChecks,
			numberOfChecks: 0
		})
	};

export const totalPaycheckIncomeMonoid: MonoidT<PerPaycheckIncome> = {
	empty: {
		grossPay: 0,
		numberOfChecks: 0
	},
	concat: (a, b): PerPaycheckIncome => ({
		grossPay: a.grossPay + b.grossPay * b.numberOfChecks,
		numberOfChecks: 0
	})
};
