/**
 * Domain service for calculating budget progress.
 * Pure functions - no I/O, no async, no DOM dependencies.
 */

export type BudgetStatus = 'on-track' | 'at-risk' | 'over';

export interface BudgetProgressInput {
  spent: number;
  budget: number;
}

export interface BudgetProgressData {
  readonly percent: number;       // 0-100+, using Math.floor
  readonly remaining: number;     // Can be negative for overrun
  readonly isOverrun: boolean;    // true if remaining < 0
  readonly status: BudgetStatus;  // semantic status: 'on-track' | 'at-risk' | 'over'
}

export interface BudgetProgressService {
  calculateProgress(input: BudgetProgressInput): BudgetProgressData;
  calculatePercent(spent: number, budget: number): number;
  getProgressStatus(percent: number): BudgetStatus;
}

export class BudgetProgressServiceImpl implements BudgetProgressService {
  calculateProgress(input: BudgetProgressInput): BudgetProgressData {
    const { spent, budget } = input;
    const percent = this.calculatePercent(spent, budget);
    const remaining = budget - spent;
    const isOverrun = remaining < 0;

    return {
      percent,
      remaining,
      isOverrun,
      status: this.getProgressStatus(percent),
    };
  }

  calculatePercent(spent: number, budget: number): number {
    if (budget <= 0) return spent > 0 ? 100 : 0;
    return Math.floor((spent / budget) * 100);
  }

  getProgressStatus(percent: number): BudgetStatus {
    if (percent >= 100) return 'over';
    if (percent >= 90) return 'at-risk';
    return 'on-track';
  }
}
