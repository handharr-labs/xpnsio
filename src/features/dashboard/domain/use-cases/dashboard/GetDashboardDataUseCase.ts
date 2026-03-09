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
  dailyBudget?: number;             // monthlyBudget / daysInPeriod (daily only)
  accumulatedBudgetToDate?: number; // dailyBudget × daysElapsed (daily only)
  periodDaysElapsed?: number;       // days elapsed since period start (daily only)
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

    // Auto-carry + sync logic: apply (or re-apply) setting when budgets are missing or stale
    let budgets = await this.budgetRepository.getByMonth(userId, year, month);
    const lastApp = await this.budgetRepository.getLastApplication(userId);
    if (lastApp) {
      const setting = await this.budgetSettingRepository.getById(lastApp.budgetSettingId);
      if (setting && budgets.length !== setting.items.length) {
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

    const hasActiveBudget = budgets.length > 0;

    // Resolve starterDay from the applied budget setting for this month
    const application = await this.budgetRepository.getApplication(userId, year, month);
    let starterDay = 1;
    if (application) {
      const setting = await this.budgetSettingRepository.getById(application.budgetSettingId);
      starterDay = setting?.starterDay ?? 1;
    }

    const { periodStart, periodEnd, daysInPeriod } = this.computationService.getPeriodBounds(year, month, starterDay);

    // Fetch all expense transactions and category metadata
    const [allExpenseTransactions, allCategories] = await Promise.all([
      this.transactionRepository.getFiltered({
        userId,
        startDate: periodStart,
        endDate: periodEnd,
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

      let dailyBudget: number | undefined;
      let accumulatedBudgetToDate: number | undefined;

      if (masterCategory === 'daily') {
        const input = {
          monthlyBudget: budget.amount,
          daysInMonth: daysInPeriod,
          transactions: categoryTransactions.map((tx) => ({ date: tx.date, amount: tx.amount })),
          today,
          monthStart: periodStart,
        };
        remaining = this.computationService.computeDailyRemaining(input);
        rolloverAmount = this.computationService.computeRolloverAmount(input);
        dailyBudget = budget.amount / daysInPeriod;
        const daysElapsed = Math.round(
          (new Date(today).getTime() - new Date(periodStart).getTime()) / 86400000
        ) + 1;
        accumulatedBudgetToDate = dailyBudget * daysElapsed;
        categoryInfoList.push({
          categoryId: budget.categoryId,
          categoryName: category?.name ?? budget.categoryId,
          masterCategory,
          monthlyBudget: budget.amount,
          totalSpent,
          remaining,
          rolloverAmount,
          dailyBudget,
          accumulatedBudgetToDate,
          periodDaysElapsed: daysElapsed,
        });
        continue;
      } else if (masterCategory === 'weekly') {
        remaining = this.computationService.computeWeeklyRemaining({
          monthlyBudget: budget.amount,
          weeksInMonth: daysInPeriod / 7,
          transactions: categoryTransactions.map((tx) => ({ date: tx.date, amount: tx.amount })),
          today,
          monthStart: periodStart,
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
        dailyBudget,
        accumulatedBudgetToDate,
      });
    }

    const totalMonthlyBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = categoryInfoList.reduce((sum, c) => sum + c.totalSpent, 0);
    const totalRemaining = totalMonthlyBudget - totalSpent;

    const recentTransactions = await this.transactionRepository.getFiltered({
      userId,
      startDate: periodStart,
      endDate: periodEnd,
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

