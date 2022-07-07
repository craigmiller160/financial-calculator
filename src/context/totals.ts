export interface TotalBenefitsCost {
	readonly name: string;
	readonly amount: number;
}

export interface Totals {
	readonly benefits: {
		readonly totalBenefitsCostByCheck: ReadonlyArray<TotalBenefitsCost>;
		readonly totalBenefitsCost: number;
	};
}
