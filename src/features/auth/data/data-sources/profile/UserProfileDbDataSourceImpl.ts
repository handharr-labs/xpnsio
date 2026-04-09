import 'server-only';
import { db } from '@/lib/db';
import { profiles } from '@/lib/schema';
import type { UserProfileDbDataSource, UserProfileRecord } from './UserProfileDbDataSource';

export class UserProfileDbDataSourceImpl implements UserProfileDbDataSource {
  async upsert(data: UserProfileRecord): Promise<void> {
    await db
      .insert(profiles)
      .values({
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        avatarUrl: data.avatarUrl,
      })
      .onConflictDoUpdate({
        target: profiles.id,
        set: {
          email: data.email,
          fullName: data.fullName,
          avatarUrl: data.avatarUrl,
          updatedAt: new Date(),
        },
      });
  }
}
