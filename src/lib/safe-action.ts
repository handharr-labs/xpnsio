import { createSafeActionClient } from 'next-safe-action';
import { auth } from '@/lib/auth';
import { handleServerActionError } from '@handharr-labs/web-server';

// Public action client — no auth required
export const actionClient = createSafeActionClient({
  handleServerError: handleServerActionError,
});

// Authenticated action client — throws UnauthorizedError if there is no valid
// session. `ctx.user` is the auth port's `AuthUser` ({ id, email, name?, imageUrl? }).
export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await auth.requireSession();
  return next({ ctx: { user: session.user } });
});
