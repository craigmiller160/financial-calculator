// TODO if this works, move it to lib

// TODO what if the action changes the type?
export const runUntil =
	<A>(stop: (a: A) => boolean) =>
	(action: (a: A) => A) =>
	(init: A) => {
		throw new Error();
	};
