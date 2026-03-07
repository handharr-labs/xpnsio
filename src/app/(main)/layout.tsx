'use client';

import { DIProvider } from '@/di/DIContext';
import type { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return <DIProvider>{children}</DIProvider>;
}
