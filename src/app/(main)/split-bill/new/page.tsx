import { Suspense } from 'react';
import { SplitBillNewView } from '@/features/split-bill/presentation/SplitBillNewView';

export default function SplitBillNewPage() {
  return (
    <Suspense fallback={null}>
      <SplitBillNewView />
    </Suspense>
  );
}
