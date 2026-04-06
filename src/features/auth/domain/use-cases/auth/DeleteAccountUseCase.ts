import type { AuthAdminRepository } from '@/features/auth/domain/repositories/AuthAdminRepository';

export interface DeleteAccountUseCase {
  execute(userId: string): Promise<void>;
}

export class DeleteAccountUseCaseImpl implements DeleteAccountUseCase {
  constructor(private readonly repository: AuthAdminRepository) {}

  async execute(userId: string): Promise<void> {
    await this.repository.deleteAccount(userId);
  }
}
