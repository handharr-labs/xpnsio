'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

export function useLoginViewModel() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authClient.signIn('google', {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        queryParams: { prompt: 'select_account' },
      });
    } catch {
      setError('Failed to sign in. Please try again.');
      setIsLoading(false);
    }
  };

  return { isLoading, error, handleGoogleSignIn };
}
