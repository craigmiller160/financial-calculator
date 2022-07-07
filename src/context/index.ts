import { PersonalData } from '../data/decoders/personalData';
import { LegalData } from '../data/decoders/legalData';
import { Data } from '../data/getData';
import { Taxes } from './taxes';
import { Totals } from './totals';
import { Contribution401k } from './contribution401k';

export interface BaseContext {
	readonly personalData: PersonalData;
	readonly legalData: LegalData;
}

export interface Context401k extends BaseContext {
	readonly contribution401k: Contribution401k;
}

export interface Context401kTaxes extends Context401k {
	readonly taxes: Taxes;
}

export interface Context401kTaxesPastTotals extends Context401kTaxes {
	readonly pastTotals: Totals;
}

export const createContext = (data: Data): BaseContext => ({
	personalData: data[0],
	legalData: data[1]
});
