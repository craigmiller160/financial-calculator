/* eslint-disable @typescript-eslint/no-explicit-any */
import { BasePaycheck, PaycheckWith401k } from '../../data/decoders';

export const isPaycheckWith401k = (
	paycheck: BasePaycheck
): paycheck is PaycheckWith401k => (paycheck as any).rate401k !== undefined;
