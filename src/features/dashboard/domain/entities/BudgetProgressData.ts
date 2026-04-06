export type BudgetStatus = 'on-track' | 'at-risk' | 'over';

export interface BudgetProgressData {
  readonly percent: number;       // 0-100+, using Math.floor
  readonly remaining: number;     // Can be negative for overrun
  readonly isOverrun: boolean;    // true if remaining < 0
  readonly status: BudgetStatus;  // semantic status: 'on-track' | 'at-risk' | 'over'
}
