'use client';

import { defineAuthClient } from '@handharr-labs/forge-auth/client';

/**
 * The single client-side auth surface — session hook + sign-in/out — behind the
 * kit's provider-agnostic `AuthClient`. Same `adapter` as `lib/auth.ts`, so the
 * UI never learns the vendor.
 */
export const authClient = defineAuthClient({
  adapter: 'supabase',
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
});
