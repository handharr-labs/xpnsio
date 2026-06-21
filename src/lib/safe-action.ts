import { createSafeActionClient } from 'next-safe-action';
import { createSupabaseServerClient } from '@/lib/auth';
import { handleServerActionError } from '@handharr-labs/web-server';

// Public action client — no auth required
export const actionClient = createSafeActionClient({
  handleServerError: handleServerActionError,
});

// Authenticated action client — throws if no valid Supabase session
export const authActionClient = actionClient.use(async ({ next }) => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) throw new Error('Unauthorized');

  return next({ ctx: { user } });
});
