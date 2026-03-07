import type { AuthRepository } from '@/domain/repositories/AuthRepository';
import type { User } from '@/domain/entities/User';
import type { AuthDataSource } from '@/data/data-sources/auth/AuthDataSource';
import { UserMapperImpl, type UserMapper } from '@/data/mappers/UserMapper';
import { DomainError } from '@/domain/errors/DomainError';

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
