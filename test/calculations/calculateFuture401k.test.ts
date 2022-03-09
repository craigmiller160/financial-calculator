import { calculateFuture401k } from '../../src/calculations/calculateFuture401k';

const REMAINING_AMOUNT = 1_000;
const TOTAL_FUTURE_INCOME = 10_000;

describe('calculateFuture401k', () => {
	it('accurately does calculation', () => {
		const [rate, amount] = calculateFuture401k(
			REMAINING_AMOUNT,
			TOTAL_FUTURE_INCOME
		);
		expect(rate).toEqual(0.1);
		expect(amount).toEqual(1000);
	});
});
