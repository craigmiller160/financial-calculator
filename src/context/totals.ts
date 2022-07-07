export interface TotalByCheck {
	readonly name: string;
	readonly amount: number;
}

export interface Totals {
	readonly totalBenefitsCost: number;
	readonly totalGrossPay: number;
	readonly totalEmployeeContribution401k: number;
	readonly totalEmployerContribution401k: number;
	readonly totalTaxes: number;
}
