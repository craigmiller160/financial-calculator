import { BaseContext } from '../context';
import { Contribution401k } from '../context/contribution401k';

export const calculateFuture401kRate = (
	context: BaseContext,
	pastContribution401k: Contribution401k
): number => {
	throw new Error();
};
