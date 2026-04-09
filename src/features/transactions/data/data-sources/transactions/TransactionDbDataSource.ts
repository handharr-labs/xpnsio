export interface TransactionRecord {
  readonly id: string;
  readonly userId: string;
  readonly categoryId: string | null;
  readonly amount: string;
  readonly type: 'income' | 'expense';
  readonly description: string | null;
  readonly date: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly categoryName: string | null;
}

export interface TransactionFilterParams {
  readonly userId: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly categoryId?: string;
  readonly type?: 'income' | 'expense';
  readonly description?: string;
  readonly limit?: number;
  readonly offset?: number;
}

export interface TransactionDbDataSource {
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
