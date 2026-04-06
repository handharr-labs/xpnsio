import { DomainError } from '@/shared/domain/errors/DomainError';
import type { AuthAdminRepository } from '@/features/auth/domain/repositories/AuthAdminRepository';
import type { AuthAdminDataSource } from '@/features/auth/data/data-sources/auth/AuthAdminDataSource';

export class AuthAdminRepositoryImpl implements AuthAdminRepository {
  constructor(private readonly dataSource: AuthAdminDataSource) {}

  async deleteAccount(userId: string): Promise<void> {
    try {
      await this.dataSource.deleteUser(userId);
    } catch (error) {
      throw DomainError.serverError(String(error));
    }
  }
}
