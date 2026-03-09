import type {
  Transaction as DbTransaction,
  NewTransaction,
} from '@/lib/schema';

export interface TransactionRecord extends DbTransaction {
  categoryName: string | null;
}

export interface TransactionFilterParams {
  userId: string;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  type?: 'income' | 'expense';
  limit?: number;
  offset?: number;
}

export interface TransactionDataSource {
  getFiltered(params: TransactionFilterParams): Promise<TransactionRecord[]>;
  getById(id: string): Promise<TransactionRecord | null>;
  create(data: Omit<NewTransaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<TransactionRecord>;
  update(
    id: string,
    data: Partial<Pick<NewTransaction, 'amount' | 'categoryId' | 'description' | 'date' | 'type'>>
  ): Promise<TransactionRecord>;
  delete(id: string): Promise<void>;
  sumByMonth(userId: string, year: number, month: number, type: 'income' | 'expense'): Promise<string>;
  getByMonthAndCategory(userId: string, year: number, month: number, categoryId: string): Promise<TransactionRecord[]>;
}
