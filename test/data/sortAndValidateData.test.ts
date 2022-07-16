import { getTestData } from '../testutils/getTestData';
import { Bonus } from '../../src/data/decoders/personalData';
import { identity, pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import { sortAndValidateData } from '../../src/data/sortAndValidateData';
import '@relmify/jest-fp-ts';
import { Data } from '../../src/data/getData';
import { IOTryT } from '@craigmiller160/ts-functions/types';

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

const prepareTestData = (modify: (d: Data) => Data = identity): IOTryT<Data> =>
	pipe(getTestData(), IOEither.map(modify));

describe('validateData', () => {
	it('data is valid', () => {
		const resultEither = pipe(
			prepareTestData(),
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
			prepareTestData(([personal, legal]) => [
				{
					...personal,
					pastBonuses: [
						...personal.pastBonuses,
						...createDuplicateBonuses()
					]
				},
				legal
			]),
			IOEither.chainEitherK(sortAndValidateData)
		)();
		expect(resultEither).toEqualLeft(
			new Error('All names must be unique. Duplicate: Bonus')
		);
	});
});
