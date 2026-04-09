import 'server-only';
import { supabaseAdmin } from '@/lib/auth';
import type { AuthAdminRemoteDataSource } from './AuthAdminRemoteDataSource';

export class AuthAdminRemoteDataSourceImpl implements AuthAdminRemoteDataSource {
  async deleteUser(id: string): Promise<void> {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) throw new Error(`Failed to delete user: ${error.message}`);
  }
}
