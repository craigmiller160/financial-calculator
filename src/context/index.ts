import { PersonalData } from '../data/decoders/personalData';
import { LegalData } from '../data/decoders/legalData';
import { Data } from '../data/getData';
import { Taxes } from './taxes';
import { Totals } from './totals';
import { Contribution401k } from './contribution401k';

export interface Context {
	readonly personalData: PersonalData;
	readonly legalData: LegalData;
	readonly pastContribution401k: Contribution401k;
}

export const createContext = (
	data: Data
): Omit<Context, 'pastContribution401k'> => ({
	personalData: data[0],
	legalData: data[1]
});
