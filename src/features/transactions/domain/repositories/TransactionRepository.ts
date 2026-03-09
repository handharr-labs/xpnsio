import type { Transaction } from '@/features/transactions/domain/entities/Transaction';

export interface TransactionFilter {
  userId: string;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  type?: 'income' | 'expense';
  limit?: number;
  offset?: number;
}

export interface TransactionRepository {
  getFiltered(filter: TransactionFilter): Promise<Transaction[]>;
  getById(id: string): Promise<Transaction | null>;
  create(data: Omit<Transaction, 'id' | 'createdAt' | 'categoryName'>): Promise<Transaction>;
  update(
    id: string,
    data: Partial<Pick<Transaction, 'amount' | 'categoryId' | 'description' | 'date' | 'type'>>
  ): Promise<Transaction>;
  delete(id: string): Promise<void>;
  sumByMonth(userId: string, year: number, month: number, type: 'income' | 'expense'): Promise<number>;
  getByMonthAndCategory(
    userId: string,
    year: number,
    month: number,
    categoryId: string
  ): Promise<Transaction[]>;
}
