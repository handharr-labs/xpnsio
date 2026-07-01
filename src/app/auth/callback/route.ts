import { auth } from '@/lib/auth';

/**
 * OAuth callback. The kit's supabase adapter handles the `?code=` exchange and,
 * because a `provisioner` is configured in `lib/auth`, upserts the user's
 * profile on first sign-in — then redirects to `?next` (defaults to '/', which
 * `app/page.tsx` forwards to `/dashboard` for an authenticated user).
 *
 * Wrapped (rather than `export const { GET } = auth.handlers`) so the handler
 * has a concrete signature for Next.js route type generation.
 */
const handleGet = auth.handlers.GET as (request: Request) => Promise<Response>;

export function GET(request: Request): Promise<Response> {
  return handleGet(request);
}
