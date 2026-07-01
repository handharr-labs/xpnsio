'use client';

import type { ReactNode } from 'react';
import { authClient } from '@/lib/auth-client';

/**
 * Mounts the kit's auth session context once at the app root so `useSession`
 * works anywhere in the tree. A thin client wrapper so the (server) root layout
 * can render it without importing the client `authClient` directly.
 */
export function AuthClientProvider({ children }: { children: ReactNode }) {
  return <authClient.AuthProvider>{children}</authClient.AuthProvider>;
}
