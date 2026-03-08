import type { TransactionRepository, TransactionFilter } from '@/domain/repositories/TransactionRepository';
import type { Transaction } from '@/domain/entities/Transaction';
import type { TransactionDataSource } from '@/data/data-sources/transactions/TransactionDataSource';
import { TransactionMapperImpl, type TransactionMapper } from '@/data/mappers/TransactionMapper';
import { DomainError } from '@/domain/errors/DomainError';

export class TransactionRepositoryImpl implements TransactionRepository {
  constructor(
    private readonly dataSource: TransactionDataSource,
    private readonly mapper: TransactionMapper = new TransactionMapperImpl()
  ) {}

  async getFiltered(filter: TransactionFilter): Promise<Transaction[]> {
    try {
      const records = await this.dataSource.getFiltered(filter);
      return records.map((r) => this.mapper.toDomain(r));
    } catch (error) {
      throw DomainError.serverError(String(error));
    }
  }

  async getById(id: string): Promise<Transaction | null> {
    try {
      const record = await this.dataSource.getById(id);
      return record ? this.mapper.toDomain(record) : null;
    } catch (error) {
      throw DomainError.serverError(String(error));
    }
  }

  async create(data: Omit<Transaction, 'id' | 'createdAt' | 'categoryName'>): Promise<Transaction> {
    try {
      const record = await this.dataSource.create({
        userId: data.userId,
        categoryId: data.categoryId,
        amount: String(data.amount),
        type: data.type,
        description: data.description,
        date: data.date,
      });
      return this.mapper.toDomain(record);
    } catch (error) {
      throw DomainError.serverError(String(error));
    }
  }

  async update(
    id: string,
    data: Partial<Pick<Transaction, 'amount' | 'categoryId' | 'description' | 'date' | 'type'>>
  ): Promise<Transaction> {
    try {
      const updateData: Parameters<TransactionDataSource['update']>[1] = {};
      if (data.amount !== undefined) updateData.amount = String(data.amount);
      if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.date !== undefined) updateData.date = data.date;
      if (data.type !== undefined) updateData.type = data.type;

      const record = await this.dataSource.update(id, updateData);
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

  async sumByMonth(
    userId: string,
    year: number,
    month: number,
    type: 'income' | 'expense'
  ): Promise<number> {
    try {
      const total = await this.dataSource.sumByMonth(userId, year, month, type);
      return parseFloat(total);
    } catch (error) {
      throw DomainError.serverError(String(error));
    }
  }

  async getByMonthAndCategory(
    userId: string,
    year: number,
    month: number,
    categoryId: string
  ): Promise<Transaction[]> {
    try {
      const records = await this.dataSource.getByMonthAndCategory(userId, year, month, categoryId);
      return records.map((r) => this.mapper.toDomain(r));
    } catch (error) {
      throw DomainError.serverError(String(error));
    }
  }
}
