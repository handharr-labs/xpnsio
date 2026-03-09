export interface Transaction {
  readonly id: string;
  readonly userId: string;
  readonly categoryId: string | null;
  readonly categoryName: string | null; // joined
  readonly amount: number;
  readonly type: 'income' | 'expense';
  readonly description: string | null;
  readonly date: string; // YYYY-MM-DD
  readonly createdAt: Date;
}
