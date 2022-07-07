import { Data } from './getData';
import { TryT, MonoidT } from '@craigmiller160/ts-functions/types';
import { PersonalData } from './decoders/personalData';
import { constVoid, pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import * as Monoid from 'fp-ts/Monoid';
import * as Either from 'fp-ts/Either';
import * as Option from 'fp-ts/Option';

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

export const validateData = (data: Data): TryT<Data> =>
	pipe(
		validateNames(data[0]),
		Either.map(() => data)
	);
