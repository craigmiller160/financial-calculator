import { Rate401k } from '../../data/decoders';

export const hasRate401k = (value: unknown): boolean => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (value as any).rate401k !== undefined;
};
