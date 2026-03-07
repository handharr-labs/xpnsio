import { createSafeActionClient } from 'next-safe-action';
import { createSupabaseServerClient } from '@/lib/auth';
import { DomainError } from '@/domain/errors/DomainError';

// Public action client — no auth required
export const actionClient = createSafeActionClient({
  handleServerError(error) {
    if (error instanceof DomainError) return error.message;
    return 'An unexpected error occurred.';
  },
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
