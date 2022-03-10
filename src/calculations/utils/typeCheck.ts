/* eslint-disable @typescript-eslint/no-explicit-any */
import { Rate401k } from '../../data/decoders';

export const hasRate401k = (value: any): value is Rate401k =>
	value.rate401k !== undefined;
