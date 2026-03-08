import type { Category, MasterCategory } from '@/domain/entities/Category';
import type { CategoryRepository } from '@/domain/repositories/CategoryRepository';
import { DomainError } from '@/domain/errors/DomainError';

export interface CreateCategoryInput {
  userId: string;
  name: string;
  type: 'income' | 'expense';
  masterCategory: MasterCategory | null;
  color: string;
  icon: string;
}

export interface CreateCategoryUseCase {
  execute(data: CreateCategoryInput): Promise<Category>;
}

export class CreateCategoryUseCaseImpl implements CreateCategoryUseCase {
  constructor(private readonly repository: CategoryRepository) {}

  async execute(data: CreateCategoryInput): Promise<Category> {
    if (!data.name.trim()) {
      throw DomainError.validationFailed('name', 'Name is required');
    }

    if (data.type === 'expense' && !data.masterCategory) {
      throw DomainError.validationFailed(
        'masterCategory',
        'masterCategory is required for expense categories'
      );
    }

    return this.repository.create({
      userId: data.userId,
      name: data.name.trim(),
      type: data.type,
      masterCategory: data.masterCategory,
      color: data.color,
      icon: data.icon,
    });
  }
}
