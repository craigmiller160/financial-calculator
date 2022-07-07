export interface Contribution401kByItem {
	readonly name: string;
	readonly employeeContribution: number;
	readonly employerContribution: number;
}

export interface Contribution401k {
	readonly contributionsByPaycheck: ReadonlyArray<Contribution401kByItem>;
	readonly contributionsByBonus: ReadonlyArray<Contribution401kByItem>;
}
