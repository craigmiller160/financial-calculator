import { TryT, OptionT } from '@craigmiller160/ts-functions/types';
import * as RArray from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as Either from 'fp-ts/Either';

interface NamedItem {
	readonly name: string;
}

export const findNamedItemE = <T extends NamedItem>(
	items: ReadonlyArray<T>
): ((name: string) => TryT<T>) => {
	const findItem = findNamedItemO(items);
	return (name) =>
		pipe(
			findItem(name),
			Either.fromOption(
				() => new Error(`Unable to find named item: ${name}`)
			)
		);
};

export const findNamedItemO =
	<T extends NamedItem>(items: ReadonlyArray<T>) =>
	(name: string): OptionT<T> =>
		pipe(
			items,
			RArray.findFirst((item) => item.name === name)
		);
