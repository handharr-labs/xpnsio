import type { Transaction } from '@/features/transactions/domain/entities/Transaction';
import type { CategoryBudgetInfo } from './CategoryBudgetInfo';

export interface DashboardData {
  readonly totalMonthlyBudget: number;
  readonly totalSpent: number;
  readonly totalRemaining: number;
  readonly categories: CategoryBudgetInfo[];
  readonly recentTransactions: Transaction[];
  readonly hasActiveBudget: boolean;
  readonly periodEnd: string;
}
