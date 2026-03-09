import type { Transaction } from '@/features/transactions/domain/entities/Transaction';
import type { BudgetRepository } from '@/features/budget-settings/domain/repositories/BudgetRepository';
import type { BudgetSettingRepository } from '@/features/budget-settings/domain/repositories/BudgetSettingRepository';
import type { TransactionRepository } from '@/features/transactions/domain/repositories/TransactionRepository';
import type { CategoryRepository } from '@/features/categories/domain/repositories/CategoryRepository';
import type { BudgetComputationService } from '@/features/budget-settings/domain/services/BudgetComputationService';

export interface CategoryBudgetInfo {
  categoryId: string;
  categoryName: string;
  masterCategory: 'daily' | 'weekly' | 'monthly';
  monthlyBudget: number;
  totalSpent: number;
  remaining: number;
  rolloverAmount: number; // only meaningful for daily/weekly
}

export interface DashboardData {
  totalMonthlyBudget: number;
  totalSpent: number;
  totalRemaining: number;
  categories: CategoryBudgetInfo[];
  recentTransactions: Transaction[];
  hasActiveBudget: boolean;
}

export interface GetDashboardDataParams {
  userId: string;
  year: number;
  month: number;
  today: string; // YYYY-MM-DD, provided by the caller (Server Action)
}

export interface GetDashboardDataUseCase {
  execute(params: GetDashboardDataParams): Promise<DashboardData>;
}

export class GetDashboardDataUseCaseImpl implements GetDashboardDataUseCase {
  constructor(
    private readonly budgetRepository: BudgetRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly computationService: BudgetComputationService,
    private readonly categoryRepository: CategoryRepository,
    private readonly budgetSettingRepository: BudgetSettingRepository
  ) {}

  async execute(params: GetDashboardDataParams): Promise<DashboardData> {
    const { userId, year, month, today } = params;

    // Auto-carry logic: if no budget for this month, copy from last applied setting
    let budgets = await this.budgetRepository.getByMonth(userId, year, month);
    if (budgets.length === 0) {
      const lastApp = await this.budgetRepository.getLastApplication(userId);
      if (lastApp) {
        const setting = await this.budgetSettingRepository.getById(lastApp.budgetSettingId);
        if (setting) {
          const items = setting.items.map((item) => ({
            categoryId: item.categoryId,
            monthlyAmount: String(item.monthlyAmount),
          }));
          await this.budgetRepository.applyBudgetSetting(
            userId,
            lastApp.budgetSettingId,
            items,
            year,
            month
          );
          budgets = await this.budgetRepository.getByMonth(userId, year, month);
        }
      }
    }

    const hasActiveBudget = budgets.length > 0;

    const daysInMonth = this.computationService.getDaysInMonth(year, month);
    const monthStr = String(month).padStart(2, '0');
    const monthStart = `${year}-${monthStr}-01`;
    const monthEnd = `${year}-${monthStr}-${String(daysInMonth).padStart(2, '0')}`;
    // Fetch all expense transactions and category metadata
    const [allExpenseTransactions, allCategories] = await Promise.all([
      this.transactionRepository.getFiltered({
        userId,
        startDate: monthStart,
        endDate: monthEnd,
        type: 'expense',
      }),
      this.categoryRepository.getByUser(userId),
    ]);

    const categoryMap = new Map(allCategories.map((c) => [c.id, c]));

    // Build category budget info
    const categoryInfoList: CategoryBudgetInfo[] = [];

    for (const budget of budgets) {
      const category = categoryMap.get(budget.categoryId);
      const masterCategory = category?.masterCategory ?? 'monthly';

      const categoryTransactions = allExpenseTransactions.filter(
        (tx) => tx.categoryId === budget.categoryId
      );
      const totalSpent = categoryTransactions.reduce((sum, tx) => sum + tx.amount, 0);

      let remaining: number;
      let rolloverAmount = 0;

      if (masterCategory === 'daily') {
        const input = {
          monthlyBudget: budget.amount,
          daysInMonth,
          transactions: categoryTransactions.map((tx) => ({ date: tx.date, amount: tx.amount })),
          today,
          monthStart,
        };
        remaining = this.computationService.computeDailyRemaining(input);
        rolloverAmount = this.computationService.computeRolloverAmount(input);
      } else if (masterCategory === 'weekly') {
        remaining = this.computationService.computeWeeklyRemaining({
          monthlyBudget: budget.amount,
          weeksInMonth: daysInMonth / 7,
          transactions: categoryTransactions.map((tx) => ({ date: tx.date, amount: tx.amount })),
          today,
          monthStart,
        });
      } else {
        remaining = this.computationService.computeMonthlyRemaining({
          monthlyBudget: budget.amount,
          transactions: categoryTransactions.map((tx) => ({ amount: tx.amount })),
        });
      }

      categoryInfoList.push({
        categoryId: budget.categoryId,
        categoryName: category?.name ?? budget.categoryId,
        masterCategory,
        monthlyBudget: budget.amount,
        totalSpent,
        remaining,
        rolloverAmount,
      });
    }

    const totalMonthlyBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = categoryInfoList.reduce((sum, c) => sum + c.totalSpent, 0);
    const totalRemaining = totalMonthlyBudget - totalSpent;

    const recentTransactions = await this.transactionRepository.getFiltered({
      userId,
      startDate: monthStart,
      endDate: monthEnd,
      limit: 10,
    });

    return {
      totalMonthlyBudget,
      totalSpent,
      totalRemaining,
      categories: categoryInfoList,
      recentTransactions,
      hasActiveBudget,
    };
  }

}

