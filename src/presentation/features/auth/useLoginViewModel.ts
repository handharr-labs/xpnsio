'use client';

import { useState } from 'react';
import { useDI } from '@/di/DIContext';

export function useLoginViewModel() {
  const { signInWithGoogleUseCase } = useDI();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogleUseCase.execute();
    } catch {
      setError('Failed to sign in. Please try again.');
      setIsLoading(false);
    }
  };

  return { isLoading, error, handleGoogleSignIn };
}
