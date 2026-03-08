import type { CategoryRepository } from '@/domain/repositories/CategoryRepository';
import type { Category } from '@/domain/entities/Category';
import type { CategoryDataSource } from '@/data/data-sources/categories/CategoryDataSource';
import { CategoryMapperImpl, type CategoryMapper } from '@/data/mappers/CategoryMapper';
import { DomainError } from '@/domain/errors/DomainError';

export class CategoryRepositoryImpl implements CategoryRepository {
  constructor(
    private readonly dataSource: CategoryDataSource,
    private readonly mapper: CategoryMapper = new CategoryMapperImpl()
  ) {}

  async getByUser(userId: string): Promise<Category[]> {
    try {
      const records = await this.dataSource.getByUser(userId);
      return records.map((r) => this.mapper.toDomain(r));
    } catch (error) {
      throw DomainError.serverError(String(error));
    }
  }

  async getById(id: string): Promise<Category | null> {
    try {
      const record = await this.dataSource.getById(id);
      return record ? this.mapper.toDomain(record) : null;
    } catch (error) {
      throw DomainError.serverError(String(error));
    }
  }

  async create(data: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    try {
      const record = await this.dataSource.create({
        userId: data.userId,
        name: data.name,
        type: data.type,
        masterCategory: data.masterCategory,
        color: data.color,
        icon: data.icon,
      });
      return this.mapper.toDomain(record);
    } catch (error) {
      throw DomainError.serverError(String(error));
    }
  }

  async update(
    id: string,
    data: Partial<Pick<Category, 'name' | 'color' | 'icon' | 'masterCategory'>>
  ): Promise<Category> {
    try {
      const record = await this.dataSource.update(id, {
        name: data.name,
        color: data.color,
        icon: data.icon,
        masterCategory: data.masterCategory,
      });
      if (!record) throw DomainError.notFound('Category', id);
      return this.mapper.toDomain(record);
    } catch (error) {
      if (error instanceof DomainError) throw error;
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

  async hasTransactions(id: string): Promise<boolean> {
    try {
      const count = await this.dataSource.countTransactions(id);
      return count > 0;
    } catch (error) {
      throw DomainError.serverError(String(error));
    }
  }
}
