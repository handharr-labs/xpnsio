import type { AuthRepository } from '@/features/auth/domain/repositories/AuthRepository';
import type { User } from '@/features/auth/domain/entities/User';
import type { AuthDataSource } from '@/features/auth/data/data-sources/auth/AuthDataSource';
import { UserMapperImpl, type UserMapper } from '@/features/auth/data/mappers/UserMapper';
import { DomainError } from '@/shared/domain/errors/DomainError';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    private readonly dataSource: AuthDataSource,
    private readonly mapper: UserMapper = new UserMapperImpl()
  ) {}

  async signInWithGoogle(): Promise<void> {
    try {
      await this.dataSource.signInWithGoogle();
    } catch (error) {
      throw DomainError.serverError(String(error));
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.dataSource.signOut();
    } catch (error) {
      throw DomainError.serverError(String(error));
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const record = await this.dataSource.getCurrentUser();
      return record ? this.mapper.toDomain(record) : null;
    } catch (error) {
      throw DomainError.serverError(String(error));
    }
  }
}
