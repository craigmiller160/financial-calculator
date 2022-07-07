import { getTestData } from '../testutils/getTestData';
import { Bonus } from '../../src/data/decoders/personalData';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import { validateData } from '../../src/data/validateData';
import '@relmify/jest-fp-ts';
import { Data } from '../../src/data/getData';

const createDuplicateBonuses = (): ReadonlyArray<Bonus> => [
	{
		name: 'Bonus',
		date: '2022-01-01',
		grossPay: 100,
		rates401k: {
			employerRate: 0,
			employeeRate: undefined
		}
	},
	{
		name: 'Bonus',
		date: '2022-01-01',
		grossPay: 100,
		rates401k: {
			employerRate: 0,
			employeeRate: undefined
		}
	}
];

describe('validateData', () => {
	it('data is valid', () => {
		const resultEither = pipe(
			getTestData(),
			IOEither.chainEitherK(validateData)
		)();
		expect(resultEither).toBeRight();
	});

	it('data has duplicate name', () => {
		const resultEither = pipe(
			getTestData(),
			IOEither.map(([personal, legal]): Data => {
				return [
					{
						...personal,
						pastBonuses: [
							...personal.pastBonuses,
							...createDuplicateBonuses()
						]
					},
					legal
				];
			}),
			IOEither.chainEitherK(validateData)
		)();
		expect(resultEither).toEqualLeft(
			new Error('All names must be unique. Duplicate: Bonus')
		);
	});
});
