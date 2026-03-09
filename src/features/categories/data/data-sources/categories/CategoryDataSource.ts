export interface CategoryRecord {
  id: string;
  userId: string;
  name: string;
  masterCategory: 'daily' | 'weekly' | 'monthly';
  color: string;
  icon: string;
  createdAt: Date;
}

export interface CategoryDataSource {
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
