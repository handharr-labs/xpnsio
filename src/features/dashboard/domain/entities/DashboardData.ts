import type { Transaction } from '@/features/transactions/domain/entities/Transaction';
import type { CategoryBudgetInfo } from './CategoryBudgetInfo';

export interface DashboardData {
  totalMonthlyBudget: number;
  totalSpent: number;
  totalRemaining: number;
  categories: CategoryBudgetInfo[];
  recentTransactions: Transaction[];
  hasActiveBudget: boolean;
  periodEnd: string;
}
