import { createBrowserClient } from '@supabase/ssr';

/**
 * Cookie-based storage adapter for the browser Supabase client.
 *
 * iOS Safari in PWA standalone mode does NOT persist localStorage between
 * app launches — it is cleared when the user closes the app. Cookies ARE
 * persisted. By pointing createBrowserClient at document.cookie we ensure
 * the session survives PWA relaunches on iPhone.
 *
 * The server-side client (src/lib/auth.ts) and middleware.ts already read
 * cookies, so this makes the client side consistent with the server side.
 */
function getCookieStorage() {
  return {
    getItem(key: string): string | null {
      if (typeof document === 'undefined') return null;
      const match = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${key}=`));
      return match
        ? decodeURIComponent(match.split('=').slice(1).join('='))
        : null;
    },
    setItem(key: string, value: string): void {
      if (typeof document === 'undefined') return;
      // 400 days — same lifetime Supabase uses for refresh tokens
      const maxAge = 60 * 60 * 24 * 400;
      document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
    },
    removeItem(key: string): void {
      if (typeof document === 'undefined') return;
      document.cookie = `${key}=; path=/; max-age=0; SameSite=Lax; Secure`;
    },
  };
}

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: getCookieStorage(),
        persistSession: true,
      },
    }
  );
}
