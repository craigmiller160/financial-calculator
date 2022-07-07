import { PersonalData } from '../data/decoders/personalData';
import { LegalData } from '../data/decoders/legalData';
import { Data } from '../data/getData';

export interface Context {
	readonly personalData: PersonalData;
	readonly legalData: LegalData;
}

export const createContext = (data: Data): Context => ({
	personalData: data[0],
	legalData: data[1]
});
