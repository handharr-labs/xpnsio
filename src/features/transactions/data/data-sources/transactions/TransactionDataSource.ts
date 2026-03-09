export interface TransactionRecord {
  id: string;
  userId: string;
  categoryId: string | null;
  amount: string;
  type: 'income' | 'expense';
  description: string | null;
  date: string;
  createdAt: Date;
  updatedAt: Date;
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
  create(data: {
    userId: string;
    categoryId?: string | null;
    amount: string;
    type: 'income' | 'expense';
    description?: string | null;
    date: string;
  }): Promise<TransactionRecord>;
  update(
    id: string,
    data: {
      amount?: string;
      categoryId?: string | null;
      description?: string | null;
      date?: string;
      type?: 'income' | 'expense';
    }
  ): Promise<TransactionRecord>;
  delete(id: string): Promise<void>;
  sumByMonth(userId: string, year: number, month: number, type: 'income' | 'expense'): Promise<string>;
  getByMonthAndCategory(userId: string, year: number, month: number, categoryId: string): Promise<TransactionRecord[]>;
}
