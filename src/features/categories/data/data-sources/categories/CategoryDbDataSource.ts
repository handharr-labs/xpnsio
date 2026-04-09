export interface CategoryRecord {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly masterCategory: 'daily' | 'weekly' | 'monthly';
  readonly color: string;
  readonly icon: string;
  readonly createdAt: Date;
}

export interface CategoryDbDataSource {
  getByUser(userId: string): Promise<CategoryRecord[]>;
  getById(id: string): Promise<CategoryRecord | null>;
  create(data: {
    userId: string;
    name: string;
    masterCategory: 'daily' | 'weekly' | 'monthly';
    color?: string;
    icon?: string;
  }): Promise<CategoryRecord>;
  update(
    id: string,
    data: {
      name?: string;
      color?: string;
      icon?: string;
      masterCategory?: 'daily' | 'weekly' | 'monthly';
    }
  ): Promise<CategoryRecord>;
  delete(id: string): Promise<void>;
  countTransactions(id: string): Promise<number>;
}
