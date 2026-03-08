import type { Category as DomainCategory } from '@/domain/entities/Category';
import type { CategoryRecord } from '@/data/data-sources/categories/CategoryDataSource';

export interface CategoryMapper {
  toDomain(record: CategoryRecord): DomainCategory;
}

export class CategoryMapperImpl implements CategoryMapper {
  toDomain(record: CategoryRecord): DomainCategory {
    return {
      id: record.id,
      userId: record.userId,
      name: record.name,
      type: record.type,
      masterCategory: record.masterCategory ?? null,
      color: record.color,
      icon: record.icon,
      createdAt: record.createdAt,
    };
  }
}
