import { PersonalData } from '../data/decoders/personalData';
import { LegalData } from '../data/decoders/legalData';
import { Data } from '../data/getData';
import { Taxes } from './taxes';
import { Totals } from './totals';

export interface BaseContext {
	readonly personalData: PersonalData;
	readonly legalData: LegalData;
}

export interface ContextWithTaxes extends BaseContext {
	readonly taxes: Taxes;
}

export interface ContextWithTaxesAndPastTotal extends BaseContext {
	readonly pastTotals: Totals;
}

export const createContext = (data: Data): BaseContext => ({
	personalData: data[0],
	legalData: data[1]
});
