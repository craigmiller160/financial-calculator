export type TotalType = 'paycheck' | 'bonus';

export interface Totals {
	readonly name: string;
	readonly type: TotalType;
	readonly benefits: number;
}
