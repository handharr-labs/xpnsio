import type {
  Budget as DomainBudget,
  MonthlyBudgetApplication as DomainMonthlyBudgetApplication,
} from '@/domain/entities/Budget';
import type {
  BudgetRecord,
  MonthlyBudgetApplicationRecord,
} from '@/data/data-sources/budgets/BudgetDataSource';

export interface BudgetMapper {
  toDomain(record: BudgetRecord): DomainBudget;
  applicationToDomain(record: MonthlyBudgetApplicationRecord): DomainMonthlyBudgetApplication;
}

export class BudgetMapperImpl implements BudgetMapper {
  toDomain(record: BudgetRecord): DomainBudget {
    return {
      id: record.id,
      userId: record.userId,
      categoryId: record.categoryId,
      amount: parseFloat(record.amount),
      month: record.month,
      year: record.year,
    };
  }

  applicationToDomain(record: MonthlyBudgetApplicationRecord): DomainMonthlyBudgetApplication {
    return {
      id: record.id,
      userId: record.userId,
      budgetSettingId: record.budgetSettingId,
      month: record.month,
      year: record.year,
    };
  }
}
