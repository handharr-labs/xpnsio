export interface AuthAdminRemoteDataSource {
  deleteUser(id: string): Promise<void>;
}
