import { createSupabaseBrowserClient as createClient } from '@handharr-labs/forge-web-client/data/supabase';

export function createSupabaseBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
