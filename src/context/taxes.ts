export interface TaxesByItem {
	readonly name: string;
	readonly socialSecurityAmount: number;
	readonly medicareAmount: number;
	readonly effectiveFederalRate: number;
	readonly effectiveFederalAmount: number;
}

export interface Taxes {
	readonly taxesByPaycheck: ReadonlyArray<TaxesByItem>;
	readonly taxesByBonus: ReadonlyArray<TaxesByItem>;
	readonly taxesByInvestment: ReadonlyArray<TaxesByItem>;
}
