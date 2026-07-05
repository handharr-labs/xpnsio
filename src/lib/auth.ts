import 'server-only';
import { cookies } from 'next/headers';
import { defineAuth } from '@handharr-labs/forge-auth/server';

/**
 * The single auth config for the app. Everything auth-related — session access,
 * the OAuth callback handler, sign-in/out, provisioning — is wired here behind
 * the kit's `AuthGateway` port. Switching providers would be the one `adapter`
 * field; the rest of the app never learns the vendor.
 *
 * The Supabase service-role client for admin ops lives in `lib/supabase-admin.ts`
 * (out of port scope), and the browser Supabase client for Storage lives in
 * `lib/supabase-browser.ts` (a data client, unrelated to auth).
 */
export const auth = defineAuth({
  adapter: 'supabase',
  // Supabase manages its own session signing, so `secret` is inert for this
  // adapter — the kit's config just requires a non-empty value.
  secret: process.env.AUTH_SECRET ?? 'supabase-managed',
  // Providers are configured in the Supabase dashboard, not in code — the key
  // just declares that Google is enabled.
  providers: { google: {} },
  loginPath: '/login',
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    // Next 15/16 `cookies()` is async — the kit accepts an async provider.
    cookies: async () => {
      const cookieStore = await cookies();
      return {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — the middleware refreshes cookies.
          }
        },
      };
    },
  },
  // Provisioning (optional): upsert the app's `users` row on sign-in. Lazy-import
  // the DI container so `lib/auth` doesn't form an import cycle with it (the
  // container transitively imports the admin data source).
  provisioner: {
    onSignIn: async (profile) => {
      const { createServerContainer } = await import(
        '@/shared/di/container.server'
      );
      const container = createServerContainer();
      await container.upsertUserProfileUseCase.execute({
        id: profile.providerAccountId,
        email: profile.email,
        fullName: profile.name ?? null,
        avatarUrl: profile.imageUrl ?? null,
      });
      return {
        id: profile.providerAccountId,
        email: profile.email,
        name: profile.name,
        imageUrl: profile.imageUrl,
      };
    },
  },
});
