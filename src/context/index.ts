import { PersonalData } from '../data/decoders/personalData';
import { LegalData } from '../data/decoders/legalData';
import { Data } from '../data/getData';
import { Contribution401k } from './contribution401k';
import { PayrollTaxes } from './payrollTaxes';

export interface BaseContext {
	readonly personalData: PersonalData;
	readonly legalData: LegalData;
}

export interface Context extends BaseContext {
	readonly pastContribution401k: Contribution401k;
	readonly payrollTaxes: PayrollTaxes;
	readonly futureRate401k: number;
	readonly futureContribution401k: Contribution401k;
}

export const createContext = (data: Data): BaseContext => ({
	personalData: data[0],
	legalData: data[1]
});
