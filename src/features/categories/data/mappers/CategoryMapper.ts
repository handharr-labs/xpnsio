import type { Category as DomainCategory } from '@/features/categories/domain/entities/Category';
import type { CategoryRecord } from '@/features/categories/data/data-sources/categories/CategoryDataSource';

export interface CategoryMapper {
  toDomain(record: CategoryRecord): DomainCategory;
}

export class CategoryMapperImpl implements CategoryMapper {
  toDomain(record: CategoryRecord): DomainCategory {
    return {
      id: record.id,
      userId: record.userId,
      name: record.name,
      masterCategory: record.masterCategory,
      color: record.color,
      icon: record.icon,
      createdAt: record.createdAt,
    };
  }
}
