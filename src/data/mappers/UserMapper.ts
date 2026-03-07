import type { User } from '@/domain/entities/User';
import type { AuthUserRecord } from '@/data/data-sources/auth/AuthDataSource';

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
