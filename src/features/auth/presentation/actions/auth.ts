'use server';

import { z } from 'zod';
import { authActionClient } from '@/lib/safe-action';
import { supabaseAdmin } from '@/lib/auth';

/**
 * Delete user account and all associated data.
 *
 * This uses the Supabase admin client to delete the user from auth.users.
 * Due to cascading deletes in the schema (onDelete: 'cascade' on all foreign keys
 * referencing profiles.id), deleting the auth user will automatically:
 * - Delete the profile
 * - Delete all transactions
 * - Delete all categories
 * - Delete all budgets
 * - Delete all budget settings and items
 * - Delete all monthly budget applications
 */
export const deleteAccountAction = authActionClient
  .schema(z.object({}))
  .action(async ({ ctx: { user } }) => {
    // Delete user from Supabase auth - this will cascade to all related data
    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (error) {
      throw new Error(`Failed to delete account: ${error.message}`);
    }

    return { success: true };
  });
