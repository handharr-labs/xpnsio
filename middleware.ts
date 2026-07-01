import { createAuthMiddleware } from '@handharr-labs/web-auth/middleware';

/**
 * Edge route protection via the kit's edge-safe entrypoint (no `server-only`,
 * no Node adapter). The middleware refreshes the Supabase session on every
 * matched request and redirects unauthenticated users to `/login` — except for
 * `publicPaths`, which are refreshed but never redirected.
 *
 * `'/'` is public here on purpose: `app/page.tsx` (a Server Component) owns its
 * redirect so Next.js merges the middleware's refreshed Set-Cookie headers into
 * the page-level redirect. Redirecting `/` from middleware instead drops the
 * refreshed session cookies on iOS Safari PWA.
 */
export default createAuthMiddleware({
  adapter: 'supabase',
  loginPath: '/login',
  publicPaths: ['/', '/login', '/auth'],
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
