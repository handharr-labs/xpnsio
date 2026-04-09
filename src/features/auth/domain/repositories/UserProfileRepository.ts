export interface UpsertUserProfileData {
  readonly id: string;
  readonly email: string;
  readonly fullName: string | null;
  readonly avatarUrl: string | null;
}

export interface UserProfileRepository {
  upsert(data: UpsertUserProfileData): Promise<void>;
}
