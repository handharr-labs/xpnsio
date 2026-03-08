import type { BudgetSettingRepository } from '@/domain/repositories/BudgetSettingRepository';
import type { BudgetSetting } from '@/domain/entities/BudgetSetting';
import type { BudgetSettingDataSource } from '@/data/data-sources/budget-settings/BudgetSettingDataSource';
import { BudgetSettingMapperImpl, type BudgetSettingMapper } from '@/data/mappers/BudgetSettingMapper';
import { DomainError } from '@/domain/errors/DomainError';

export class BudgetSettingRepositoryImpl implements BudgetSettingRepository {
  constructor(
    private readonly dataSource: BudgetSettingDataSource,
    private readonly mapper: BudgetSettingMapper = new BudgetSettingMapperImpl()
  ) {}

  async getByUser(userId: string): Promise<BudgetSetting[]> {
    try {
      const records = await this.dataSource.getByUser(userId);
      return records.map((r) => this.mapper.toDomain(r));
    } catch (error) {
      throw DomainError.serverError(String(error));
    }
  }

  async getById(id: string): Promise<BudgetSetting | null> {
    try {
      const record = await this.dataSource.getById(id);
      return record ? this.mapper.toDomain(record) : null;
    } catch (error) {
      throw DomainError.serverError(String(error));
    }
  }

  async create(data: {
    userId: string;
    name: string;
    totalMonthlyBudget: number;
    items: Array<{ categoryId: string; monthlyAmount: number }>;
  }): Promise<BudgetSetting> {
    try {
      const record = await this.dataSource.create(
        {
          userId: data.userId,
          name: data.name,
          totalMonthlyBudget: String(data.totalMonthlyBudget),
        },
        data.items.map((item) => ({
          categoryId: item.categoryId,
          monthlyAmount: String(item.monthlyAmount),
        }))
      );
      return this.mapper.toDomain(record);
    } catch (error) {
      throw DomainError.serverError(String(error));
    }
  }

  async update(
    id: string,
    data: {
      name?: string;
      totalMonthlyBudget?: number;
      items?: Array<{ categoryId: string; monthlyAmount: number }>;
    }
  ): Promise<BudgetSetting> {
    try {
      const settingData: Parameters<BudgetSettingDataSource['update']>[1] = {};
      if (data.name !== undefined) settingData.name = data.name;
      if (data.totalMonthlyBudget !== undefined) {
        settingData.totalMonthlyBudget = String(data.totalMonthlyBudget);
      }

      const items = data.items?.map((item) => ({
        categoryId: item.categoryId,
        monthlyAmount: String(item.monthlyAmount),
      }));

      const record = await this.dataSource.update(id, settingData, items);
      return this.mapper.toDomain(record);
    } catch (error) {
      throw DomainError.serverError(String(error));
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.dataSource.delete(id);
    } catch (error) {
      throw DomainError.serverError(String(error));
    }
  }
}
