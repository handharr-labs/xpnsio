import { DIProvider } from '@/shared/di/DIContext';
import { AppBottomNav } from '@/shared/presentation/common/organisms/AppBottomNav';
import type { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <DIProvider>
      <div className="pb-20">{children}</div>
      <AppBottomNav />
    </DIProvider>
  );
}
