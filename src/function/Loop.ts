// TODO if this works, move it to lib

export const runUntil =
	<A>(stop: (a: A) => boolean) =>
	(action: (a: A) => A) =>
	(init: A): A => {
		let result: A = init;
		while (!stop(result)) {
			result = action(result);
		}
		return result;
	};
