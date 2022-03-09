import {
	totalBenefitsCostPerPaycheckMonoid,
	totalPaycheckIncomeMonoid
} from '../../src/calculations/CalculationMonoids';
import {
	PerPaycheckBenefitsCost,
	PerPaycheckIncome
} from '../../src/calculations/CalculationTypes';
import * as Monoid from 'fp-ts/Monoid';

const benefitData: ReadonlyArray<PerPaycheckBenefitsCost> = [
	{
		dental: 10,
		hsa: 15,
		medical: 20,
		vision: 25,
		numberOfChecks: 5
	},
	{
		dental: 11,
		hsa: 16,
		medical: 21,
		vision: 26,
		numberOfChecks: 6
	}
];

const paycheckData: ReadonlyArray<PerPaycheckIncome> = [
	{
		grossPay: 100,
		numberOfChecks: 3
	},
	{
		grossPay: 150,
		numberOfChecks: 2
	}
];

describe('CalculationMonoids', () => {
	it('totalBenefitsCostPerPaycheckMonoid', () => {
		const result = Monoid.concatAll(totalBenefitsCostPerPaycheckMonoid)(
			benefitData
		);
		expect(result).toEqual({
			numberOfChecks: 0,
			dental: 116,
			hsa: 171,
			medical: 226,
			vision: 281
		});
	});

	it('totalPaycheckIncomeMonoid', () => {
		const result = Monoid.concatAll(totalPaycheckIncomeMonoid)(
			paycheckData
		);
		expect(result).toEqual({
			grossPay: 600,
			numberOfChecks: 0
		});
	});
});
