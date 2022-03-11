import { BaseBonus, LegalData } from '../../data/decoders';
import { BonusWithTotal } from './TotalTypes';
import { getAmount401k, getPayrollTaxCosts, getRate401k } from './common';

export const addTotalsToBonus =
	(legalData: LegalData) =>
	<T extends BaseBonus>(bonus: T): BonusWithTotal => {
		const rate401k = getRate401k(bonus);
		const amount401k = getAmount401k(bonus.grossPay, rate401k);
		const payrollTaxCosts = getPayrollTaxCosts(
			bonus.grossPay,
			legalData.payrollTaxRates
		);
		return {
			date: bonus.date,
			grossPay: bonus.grossPay,
			estimatedAGI: 0,
			estimatedMAGI: 0,
			federalTaxCosts: {
				effectiveRate: 0,
				amount: 0
			},
			bonus401k: {
				rate: rate401k,
				amount: amount401k
			},
			payrollTaxCosts,
			takeHomePay: 0
		};
	};
