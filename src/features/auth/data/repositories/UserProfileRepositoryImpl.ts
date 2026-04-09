import type { UserProfileRepository, UpsertUserProfileData } from '@/features/auth/domain/repositories/UserProfileRepository';
import type { UserProfileDbDataSource } from '@/features/auth/data/data-sources/profile/UserProfileDbDataSource';

export class UserProfileRepositoryImpl implements UserProfileRepository {
  constructor(private readonly dataSource: UserProfileDbDataSource) {}

  async upsert(data: UpsertUserProfileData): Promise<void> {
    await this.dataSource.upsert(data);
  }
}
