import { Data } from './getData';
import { TryT, MonoidT, OrdT } from '@craigmiller160/ts-functions/types';
import { Bonus, Paycheck, PersonalData } from './decoders/personalData';
import { constVoid, pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import * as Monoid from 'fp-ts/Monoid';
import * as Either from 'fp-ts/Either';
import * as Option from 'fp-ts/Option';
import * as Time from '@craigmiller160/ts-functions/Time';
import { Ordering } from 'fp-ts/Ordering';

const parseDate = Time.parse('yyyy-MM-dd');

type NameCount = Record<string, number>;
interface NamedItem {
	readonly name: string;
}

const nameCountMonoid: MonoidT<NameCount> = {
	empty: {},
	concat: (accumulator, single) => {
		const name = Object.keys(single)[0];
		if (accumulator[name]) {
			return {
				...accumulator,
				[name]: accumulator[name] + 1
			};
		}
		return {
			...accumulator,
			...single
		};
	}
};

const validateNames = (personalData: PersonalData): TryT<void> => {
	const namedItems: ReadonlyArray<NamedItem> = [
		...personalData.pastPaychecks,
		...personalData.pastBonuses,
		...personalData.futurePaychecks,
		...personalData.futureBonuses
	];
	return pipe(
		namedItems,
		RArray.map(
			(item): NameCount => ({
				[item.name]: 1
			})
		),
		Monoid.concatAll(nameCountMonoid),
		Object.entries,
		RArray.findFirst(([, count]) => count > 1),
		Option.fold(
			() => Either.right(constVoid()),
			([name]) =>
				Either.left(
					new Error(`All names must be unique. Duplicate: ${name}`)
				)
		)
	);
};

const compareDates = (a: string, b: string): Ordering =>
	Time.compare(parseDate(a))(parseDate(b));

const paycheckSort: OrdT<Paycheck> = {
	compare: (a, b) => compareDates(a.startDate, b.startDate),
	equals: (a, b) => compareDates(a.startDate, b.startDate) === 0
};
const bonusSort: OrdT<Bonus> = {
	compare: (a, b) => compareDates(a.date, b.date),
	equals: (a, b) => compareDates(a.date, b.date) === 0
};

const sortPersonalData = (personalData: PersonalData): PersonalData => {
	const pastPaychecks = pipe(
		personalData.pastPaychecks,
		RArray.sort(paycheckSort)
	);
	const futurePaychecks = pipe(
		personalData.futurePaychecks,
		RArray.sort(paycheckSort)
	);
	const pastBonuses = pipe(personalData.pastBonuses, RArray.sort(bonusSort));
	const futureBonuses = pipe(
		personalData.futureBonuses,
		RArray.sort(bonusSort)
	);

	return {
		...personalData,
		pastPaychecks,
		futurePaychecks,
		pastBonuses,
		futureBonuses
	};
};

const paycheckOrderValidationMonoid: MonoidT<TryT<Paycheck>> = {
	empty: Either.right({
		startDate: '1900-01-01',
		endDate: '1900-01-01',
		name: '',
		grossPay: 0,
		rates401k: {
			employerRate: 0,
			employeeRate: 0
		},
		benefitsCost: {
			hsa: 0,
			fsa: 0,
			medical: 0,
			vision: 0,
			dental: 0
		},
		numberOfChecks: 0
	}),
	concat: (a, b) =>
		pipe(
			[a, b],
			Either.sequenceArray,
			Either.filterOrElse(
				([check1, check2]) =>
					compareDates(check1.endDate, check2.startDate) <= 0,
				([check1, check2]) =>
					new Error(
						`A check starts before the previous check ends: ${check1.endDate} ${check2.startDate}`
					)
			),
			Either.chain(() => b)
		)
};

const validatePaycheckOrder = (
	paychecks: ReadonlyArray<Paycheck>
): TryT<void> =>
	pipe(
		paychecks,
		RArray.map((paycheck) => Either.right(paycheck)),
		Monoid.concatAll(paycheckOrderValidationMonoid),
		Either.map(constVoid)
	);

export const sortAndValidateData = (data: Data): TryT<Data> => {
	const sortedPersonalData = sortPersonalData(data[0]);
	return pipe(
		validateNames(sortedPersonalData),
		Either.chain(() =>
			validatePaycheckOrder(sortedPersonalData.pastPaychecks)
		),
		Either.mapLeft(
			(ex) =>
				new Error('Error with order of past paychecks', {
					cause: ex
				})
		),
		Either.chain(() =>
			validatePaycheckOrder(sortedPersonalData.futurePaychecks)
		),
		Either.mapLeft(
			(ex) =>
				new Error('Error with order of future paychecks', {
					cause: ex
				})
		),
		Either.map((): Data => [sortedPersonalData, data[1]])
	);
};
