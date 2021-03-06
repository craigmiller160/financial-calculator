import { getTestData } from '../../testutils/TestData';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import {
	addTotalsToPaycheck,
	sumBenefits
} from '../../../src/calculations/totals/addTotalsToPaychecks';
import '@relmify/jest-fp-ts';
import { BenefitsCost } from '../../../src/data/decoders';

describe('addTotalsToPaychecks', () => {
	it('sums all benefits', () => {
		const benefits: BenefitsCost = {
			dental: 1,
			hsa: 2,
			medical: 3,
			vision: 4,
			fsa: 5
		};
		const result = sumBenefits(benefits);
		expect(result).toEqual(15);
	});

	it('adds the totals to past paychecks', () => {
		const result = pipe(
			getTestData(),
			IOEither.map((data) =>
				addTotalsToPaycheck(data.legalData)(
					data.personalData.pastPaychecks[0]
				)
			)
		)();
		expect(result).toEqualRight({
			startDate: '2022-01-01',
			endDate: '2022-03-11',
			estimatedTakeHomePay: 0,
			benefitsCost: {
				dental: 5.84,
				hsa: 38.46,
				fsa: 0,
				medical: 68.92,
				vision: 3.35,
				total: 116.57
			},
			numberOfChecks: 5,
			grossPay: 3724.43,
			paycheck401k: {
				rate: 0.21,
				amount: 782.1303
			},
			federalTaxCost: {
				amount: 0,
				effectiveRate: 0
			},
			estimatedAGI: 0,
			estimatedMAGI: 0,
			totalsForAllChecks: {
				contributionHsa: 192.3,
				contribution401k: 3910.6515,
				benefitsCost: 582.85,
				grossPay: 18622.15,
				estimatedAGI: 0,
				estimatedMAGI: 0,
				estimatedTakeHomePay: 0
			},
			payrollTaxCost: {
				socialSecurity: 230.91466,
				medicare: 54.004235,
				total: 284.918895
			},
			annualized: {
				estimatedAGI: 0,
				estimatedMAGI: 0,
				grossPay: 96835.18
			}
		});
	});

	it('adds the totals to future paychecks', () => {
		const result = pipe(
			getTestData(),
			IOEither.map((data) =>
				addTotalsToPaycheck(data.legalData)(
					data.personalData.futurePaychecks[0]
				)
			)
		)();
		expect(result).toEqualRight({
			startDate: '2022-03-14',
			endDate: '2022-12-31',
			estimatedTakeHomePay: 0,
			federalTaxCost: {
				amount: 0,
				effectiveRate: 0
			},
			benefitsCost: {
				dental: 10,
				hsa: 38.46,
				fsa: 0,
				medical: 0,
				vision: 10,
				total: 58.46
			},
			numberOfChecks: 21,
			grossPay: 5769.23,
			paycheck401k: {
				rate: 0,
				amount: 0
			},
			estimatedAGI: 0,
			estimatedMAGI: 0,
			totalsForAllChecks: {
				contributionHsa: 807.66,
				contribution401k: 0,
				benefitsCost: 1227.66,
				grossPay: 121153.83,
				estimatedAGI: 0,
				estimatedMAGI: 0,
				estimatedTakeHomePay: 0
			},
			payrollTaxCost: {
				socialSecurity: 357.69226,
				medicare: 83.653835,
				total: 441.346095
			},
			annualized: {
				estimatedAGI: 0,
				estimatedMAGI: 0,
				grossPay: 149999.98
			}
		});
	});
});
