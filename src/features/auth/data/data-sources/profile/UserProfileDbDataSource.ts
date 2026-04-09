export interface UserProfileRecord {
  readonly id: string;
  readonly email: string;
  readonly fullName: string | null;
  readonly avatarUrl: string | null;
}

export interface UserProfileDbDataSource {
  upsert(data: UserProfileRecord): Promise<void>;
}
