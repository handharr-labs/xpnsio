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

