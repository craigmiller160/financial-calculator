import { getTestData } from '../testutils/getTestData';
import { Bonus } from '../../src/data/decoders/personalData';
import { pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import { sortAndValidateData } from '../../src/data/sortAndValidateData';
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
			IOEither.chainEitherK(sortAndValidateData)
		)();
		expect(resultEither).toBeRight();
	});

	it('data has out of order records', () => {
		throw new Error();
	});

	it('past paychecks have invalid date record', () => {
		throw new Error();
	});

	it('future paychecks have invalid date record', () => {
		throw new Error();
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
			IOEither.chainEitherK(sortAndValidateData)
		)();
		expect(resultEither).toEqualLeft(
			new Error('All names must be unique. Duplicate: Bonus')
		);
	});
});
