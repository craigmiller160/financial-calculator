import { PersonalData } from '../data/decoders/personalData';
import { LegalData } from '../data/decoders/legalData';
import { Data } from '../data/getData';
import { Contribution401k } from './contribution401k';
import { PayrollTaxes } from './payrollTaxes';

export interface Context {
	readonly personalData: PersonalData;
	readonly legalData: LegalData;
	readonly pastContribution401k: Contribution401k;
	readonly payrollTaxes: PayrollTaxes;
}

export const createContext = (
	data: Data
): Omit<Context, 'pastContribution401k' | 'payrollTaxes'> => ({
	personalData: data[0],
	legalData: data[1]
});
