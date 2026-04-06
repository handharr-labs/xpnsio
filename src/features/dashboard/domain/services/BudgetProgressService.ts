/**
 * Domain service for calculating budget progress.
 * Pure functions - no I/O, no async, no DOM dependencies.
 */

export type { BudgetStatus, BudgetProgressData } from '@/features/dashboard/domain/entities/BudgetProgressData';
import type { BudgetStatus, BudgetProgressData } from '@/features/dashboard/domain/entities/BudgetProgressData';

export interface BudgetProgressInput {
  spent: number;
  budget: number;
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
