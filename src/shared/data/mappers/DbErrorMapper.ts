import { DomainError } from '@/shared/domain/errors/DomainError';

export interface DbErrorMapper {
  toDomain(error: unknown): DomainError;
}

export class DbErrorMapperImpl implements DbErrorMapper {
  toDomain(error: unknown): DomainError {
    if (error instanceof DomainError) return error;

    // Add ORM-specific error codes here as needed:
    // e.g. Drizzle throws generic JS errors — check message for constraint violations

    return new DomainError('unknown', { message: String(error) });
  }
}
