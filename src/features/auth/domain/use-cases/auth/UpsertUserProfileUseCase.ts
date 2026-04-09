import type { UserProfileRepository } from '@/features/auth/domain/repositories/UserProfileRepository';

export interface UpsertUserProfileInput {
  readonly id: string;
  readonly email: string;
  readonly fullName: string | null;
  readonly avatarUrl: string | null;
}

export interface UpsertUserProfileUseCase {
  execute(data: UpsertUserProfileInput): Promise<void>;
}

export class UpsertUserProfileUseCaseImpl implements UpsertUserProfileUseCase {
  constructor(private readonly repository: UserProfileRepository) {}

  async execute(data: UpsertUserProfileInput): Promise<void> {
    await this.repository.upsert(data);
  }
}
