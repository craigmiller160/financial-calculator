// TODO if this works, move it to lib

export const runUntil =
	<A>(stop: (a: A) => boolean) =>
	(action: (a: A) => A) =>
	(init: A): A => {
		let result: A = init;
		do {
			result = action(result);
		} while (!stop(result));
		return result;
	};
