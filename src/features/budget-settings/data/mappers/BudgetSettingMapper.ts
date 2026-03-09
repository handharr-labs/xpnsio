import type {
  BudgetSetting as DomainBudgetSetting,
  BudgetSettingItem as DomainBudgetSettingItem,
} from '@/features/budget-settings/domain/entities/BudgetSetting';
import type {
  BudgetSettingRecord,
  BudgetSettingItemRecord,
} from '@/features/budget-settings/data/data-sources/budget-settings/BudgetSettingDataSource';

export interface BudgetSettingMapper {
  toDomain(record: BudgetSettingRecord): DomainBudgetSetting;
  itemToDomain(record: BudgetSettingItemRecord): DomainBudgetSettingItem;
}

export class BudgetSettingMapperImpl implements BudgetSettingMapper {
  toDomain(record: BudgetSettingRecord): DomainBudgetSetting {
    return {
      id: record.id,
      userId: record.userId,
      name: record.name,
      totalMonthlyBudget: parseFloat(record.totalMonthlyBudget),
      currency: record.currency,
      starterDay: record.starterDay,
      items: record.items.map((item) => this.itemToDomain(item)),
      createdAt: record.createdAt,
    };
  }

  itemToDomain(record: BudgetSettingItemRecord): DomainBudgetSettingItem {
    return {
      id: record.id,
      budgetSettingId: record.budgetSettingId,
      categoryId: record.categoryId,
      categoryName: record.categoryName,
      masterCategory: record.masterCategory ?? null,
      monthlyAmount: parseFloat(record.monthlyAmount),
    };
  }
}
