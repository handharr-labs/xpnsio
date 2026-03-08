'use client';

import { DIProvider } from '@/di/DIContext';
import { BottomNav } from '@/presentation/common/BottomNav';
import type { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <DIProvider>
      <div className="pb-20">{children}</div>
      <BottomNav />
    </DIProvider>
  );
}
