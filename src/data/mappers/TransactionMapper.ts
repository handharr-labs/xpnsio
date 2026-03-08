import type { Transaction as DomainTransaction } from '@/domain/entities/Transaction';
import type { TransactionRecord } from '@/data/data-sources/transactions/TransactionDataSource';

export interface TransactionMapper {
  toDomain(record: TransactionRecord): DomainTransaction;
}

export class TransactionMapperImpl implements TransactionMapper {
  toDomain(record: TransactionRecord): DomainTransaction {
    return {
      id: record.id,
      userId: record.userId,
      categoryId: record.categoryId ?? null,
      categoryName: record.categoryName ?? null,
      amount: parseFloat(record.amount),
      type: record.type,
      description: record.description ?? null,
      date: record.date,
      createdAt: record.createdAt,
    };
  }
}
