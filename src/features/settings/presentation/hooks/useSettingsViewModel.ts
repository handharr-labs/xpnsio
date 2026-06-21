'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useDI } from '@/shared/di/DIContext';
import { ROUTES } from '@/shared/presentation/navigation/routes';
import { deleteAccountAction } from '@/features/auth/presentation/actions/auth';

export function useSettingsViewModel() {
  const { signOutUseCase } = useDI();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const canDelete = deleteConfirmText === 'DELETE';

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOutUseCase.execute();
      router.push(ROUTES.login);
    } catch {
      setIsSigningOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccountAction({});
      router.push(ROUTES.login);
    } catch (error) {
      setIsDeleting(false);
      setDeleteConfirmText('');
      setShowDeleteConfirm(false);
      console.error('Failed to delete account:', error);
    }
  };

  const openDeleteConfirm = () => setShowDeleteConfirm(true);

  const cancelDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setDeleteConfirmText('');
  };

  return {
    theme: theme as string | undefined,
    toggleTheme,
    isSigningOut,
    isDeleting,
    showDeleteConfirm,
    deleteConfirmText,
    canDelete,
    updateDeleteConfirmText: (v: string) => setDeleteConfirmText(v.toUpperCase()),
    handleSignOut,
    handleDeleteAccount,
    openDeleteConfirm,
    cancelDeleteConfirm,
  };
}
