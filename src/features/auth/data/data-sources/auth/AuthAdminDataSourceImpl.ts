import 'server-only';
import { supabaseAdmin } from '@/lib/auth';
import type { AuthAdminDataSource } from './AuthAdminDataSource';

export class AuthAdminDataSourceImpl implements AuthAdminDataSource {
  async deleteUser(id: string): Promise<void> {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) throw new Error(`Failed to delete user: ${error.message}`);
  }
}
