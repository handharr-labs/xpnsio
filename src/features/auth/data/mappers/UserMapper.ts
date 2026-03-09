import type { User } from '@/features/auth/domain/entities/User';
import type { AuthUserRecord } from '@/features/auth/data/data-sources/auth/AuthDataSource';

export interface UserMapper {
  toDomain(record: AuthUserRecord): User;
}

export class UserMapperImpl implements UserMapper {
  toDomain(record: AuthUserRecord): User {
    return {
      id: record.id,
      email: record.email ?? '',
      fullName: record.fullName,
      avatarUrl: record.avatarUrl,
    };
  }
}
