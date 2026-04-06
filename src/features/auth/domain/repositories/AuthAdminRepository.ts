export interface AuthAdminRepository {
  deleteAccount(userId: string): Promise<void>;
}
