import { getTestData } from '../testutils/getTestData';
import { Bonus, Paycheck } from '../../src/data/decoders/personalData';
import { identity, pipe } from 'fp-ts/function';
import * as IOEither from 'fp-ts/IOEither';
import { sortAndValidateData } from '../../src/data/sortAndValidateData';
import '@relmify/jest-fp-ts';
import { Data } from '../../src/data/getData';
import { IOTryT } from '@craigmiller160/ts-functions/types';
import { Right } from 'fp-ts/Either';

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

const createNewPaycheck = (index: number): Paycheck => ({
	startDate: `2200-0${index}-01`,
	endDate: `2200-0${index}-02`,
	grossPay: 0,
	numberOfChecks: 0,
	rates401k: {
		employerRate: 0,
		employeeRate: 0
	},
	name: `New Paycheck ${index}`,
	benefitsCost: {
		dental: 0,
		vision: 0,
		fsa: 0,
		hsa: 0,
		medical: 0
	}
});

const createNewBonus = (index: number): Bonus => ({
	date: `2200-0${index}-01`,
	grossPay: 0,
	name: `New Bonus ${index}`,
	rates401k: {
		employerRate: 0,
		employeeRate: 0
	}
});

describe('validateData', () => {
	it('data is valid', () => {
		const resultEither = pipe(
			prepareTestData(),
			IOEither.chainEitherK(sortAndValidateData)
		)();
		expect(resultEither).toBeRight();
	});

	it('data has out of order records', () => {
		const paycheck1 = createNewPaycheck(1);
		const paycheck2 = createNewPaycheck(2);
		const bonus1 = createNewBonus(1);
		const bonus2 = createNewBonus(2);
		const resultEither = pipe(
			prepareTestData(([personal, legal]) => [
				{
					...personal,
					pastPaychecks: [paycheck1, ...personal.pastPaychecks],
					futurePaychecks: [paycheck2, ...personal.futurePaychecks],
					pastBonuses: [bonus1, ...personal.pastBonuses],
					futureBonuses: [bonus2, ...personal.futureBonuses]
				},
				legal
			]),
			IOEither.chainEitherK(sortAndValidateData)
		)();
		expect(resultEither).toBeRight();
		const personalData = (resultEither as Right<Data>).right[0];

		expect(personalData.pastPaychecks).toHaveLength(8);
		expect(personalData.pastPaychecks[0]).not.toEqual(paycheck1);
		expect(personalData.pastPaychecks[7]).toEqual(paycheck1);

		expect(personalData.futurePaychecks).toHaveLength(2);
		expect(personalData.futurePaychecks[0]).not.toEqual(paycheck2);
		expect(personalData.futurePaychecks[1]).toEqual(paycheck2);

		expect(personalData.pastBonuses).toHaveLength(3);
		expect(personalData.pastBonuses[0]).not.toEqual(bonus1);
		expect(personalData.pastBonuses[2]).toEqual(bonus1);

		expect(personalData.futureBonuses).toHaveLength(1);
		expect(personalData.futureBonuses[0]).toEqual(bonus2);
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
