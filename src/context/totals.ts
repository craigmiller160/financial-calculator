export interface TotalByCheck {
	readonly name: string;
	readonly amount: number;
}

export interface Totals {
	readonly benefits: {
		readonly totalBenefitsCostByCheck: ReadonlyArray<TotalByCheck>;
		readonly totalBenefitsCost: number;
	};
	readonly grossPay: {
		readonly totalGrossPayByCheck: ReadonlyArray<TotalByCheck>;
		readonly totalGrossPayFromBonuses: number;
		readonly totalGrossPay: number;
	};
}
