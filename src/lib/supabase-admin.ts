import 'server-only';
import { createSupabaseAdminClient } from '@handharr-labs/forge-web-server/db/supabase';

/**
 * Supabase service-role client for privileged, server-only admin operations
 * (e.g. deleting an auth user). This is deliberately NOT part of the auth port —
 * admin ops are provider-specific and out of `AuthGateway`'s scope, so the app
 * owns this on the raw admin client. Never expose the service-role key to the
 * browser.
 */
export const supabaseAdmin = createSupabaseAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
