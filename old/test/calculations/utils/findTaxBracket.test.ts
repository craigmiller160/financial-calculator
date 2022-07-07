import { getTestData } from '../../testutils/TestData';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import { findTaxBracket } from '../../../src/calculations/utils/findTaxBracket';
import '@relmify/jest-fp-ts';
import { Data } from '../../../src/data/decoders';

describe('findTaxBracket', () => {
	it('bracket found', () => {
		const result = pipe(
			getTestData(),
			IOEither.chainEitherK((data) =>
				findTaxBracket(data.legalData.federalTaxBrackets, 45000)
			)
		)();

		expect(result).toEqualRight({
			rate: 0.22,
			minimumIncome: 41775,
			maximumIncome: 89075,
			baseAmountOwed: 4807.5
		});
	});

	it('bracket not found', () => {
		const result = pipe(
			getTestData(),
			IOEither.map(
				(data): Data => ({
					...data,
					legalData: {
						...data.legalData,
						federalTaxBrackets:
							data.legalData.federalTaxBrackets.filter(
								(bracket) => bracket.rate !== 0.22
							)
					}
				})
			),
			IOEither.chainEitherK((data) =>
				findTaxBracket(data.legalData.federalTaxBrackets, 45000)
			)
		)();
		expect(result).toEqualLeft(
			new Error('Unable to find tax bracket. Check tax bracket data.')
		);
	});
});
