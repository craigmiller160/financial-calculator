import { BaseContext } from '../context';
import { Contribution401k } from '../context/contribution401k';

export const calculateFutureContribution401k = (
	context: BaseContext,
	newRate401k: number
): Contribution401k => {
	throw new Error();
};
