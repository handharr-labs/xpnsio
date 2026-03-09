import type { BudgetRepository } from '@/features/budget-settings/domain/repositories/BudgetRepository';
import type { Budget, MonthlyBudgetApplication } from '@/features/budget-settings/domain/entities/Budget';
import type { BudgetDataSource } from '@/features/budget-settings/data/data-sources/budgets/BudgetDataSource';
import { BudgetMapperImpl, type BudgetMapper } from '@/features/budget-settings/data/mappers/BudgetMapper';
import { DomainError } from '@/shared/domain/errors/DomainError';

export class BudgetRepositoryImpl implements BudgetRepository {
  constructor(
    private readonly budgetDataSource: BudgetDataSource,
    private readonly mapper: BudgetMapper = new BudgetMapperImpl()
  ) {}

  async getByMonth(userId: string, year: number, month: number): Promise<Budget[]> {
    try {
      const records = await this.budgetDataSource.getByMonth(userId, year, month);
      return records.map((r) => this.mapper.toDomain(r));
    } catch (error) {
      throw DomainError.serverError(String(error));
    }
  }

  async upsertMany(budgetList: Omit<Budget, 'id'>[]): Promise<void> {
    try {
      await this.budgetDataSource.upsertMany(
        budgetList.map((b) => ({
          userId: b.userId,
          categoryId: b.categoryId,
          amount: String(b.amount),
          month: b.month,
          year: b.year,
        }))
      );
    } catch (error) {
      throw DomainError.serverError(String(error));
    }
  }

  async getApplication(
    userId: string,
    year: number,
    month: number
  ): Promise<MonthlyBudgetApplication | null> {
    try {
      const record = await this.budgetDataSource.getApplication(userId, year, month);
      return record ? this.mapper.applicationToDomain(record) : null;
    } catch (error) {
      throw DomainError.serverError(String(error));
    }
  }

  async getLastApplication(userId: string): Promise<MonthlyBudgetApplication | null> {
    try {
      const record = await this.budgetDataSource.getLastApplication(userId);
      return record ? this.mapper.applicationToDomain(record) : null;
    } catch (error) {
      throw DomainError.serverError(String(error));
    }
  }

  async applyBudgetSetting(
    userId: string,
    budgetSettingId: string,
    items: Array<{ categoryId: string; monthlyAmount: string }>,
    year: number,
    month: number
  ): Promise<void> {
    try {
      if (items.length > 0) {
        await this.budgetDataSource.upsertMany(
          items.map((item) => ({
            userId,
            categoryId: item.categoryId,
            amount: item.monthlyAmount,
            month,
            year,
          }))
        );
      }

      await this.budgetDataSource.upsertApplication({
        userId,
        budgetSettingId,
        month,
        year,
      });
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw DomainError.serverError(String(error));
    }
  }
}
