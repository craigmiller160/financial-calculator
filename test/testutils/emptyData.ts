import { Bonus, Paycheck } from '../../src/data/decoders/personalData';

export const EMPTY_BONUS: Bonus = {
	name: 'Empty Bonus',
	date: '2022-01-01',
	grossPay: 0,
	rates401k: {
		employerRate: 0,
		employeeRate: 0
	}
};

export const EMPTY_PAYCHECK: Paycheck = {
	name: 'Empty Paycheck',
	grossPay: 0,
	startDate: '2022-01-01',
	endDate: '2022-01-02',
	numberOfChecks: 0,
	rates401k: {
		employerRate: 0,
		employeeRate: 0
	},
	benefitsCost: {
		dental: 0,
		vision: 0,
		fsa: 0,
		hsa: 0,
		medical: 0
	}
};
