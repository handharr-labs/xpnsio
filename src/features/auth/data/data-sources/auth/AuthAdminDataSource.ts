export interface AuthAdminDataSource {
  deleteUser(id: string): Promise<void>;
}
