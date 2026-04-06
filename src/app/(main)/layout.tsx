import { DIProvider } from '@/shared/di/DIContext';
import { BottomNav } from '@/shared/presentation/common/organisms/BottomNav';
import type { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <DIProvider>
      <div className="pb-20">{children}</div>
      <BottomNav />
    </DIProvider>
  );
}
