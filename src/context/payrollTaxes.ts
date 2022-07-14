export interface PayrollTaxesByItem {
	readonly name: string;
	readonly socialSecurityAmount: number;
	readonly medicareAmount: number;
}

export interface PayrollTaxes {
	readonly payrollTaxesByPaycheck: ReadonlyArray<PayrollTaxesByItem>;
	readonly payrollTaxesByBonus: ReadonlyArray<PayrollTaxesByItem>;
}
