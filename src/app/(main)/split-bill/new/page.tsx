import { Suspense } from 'react';
import { SplitBillNewView } from '@/features/split-bill/presentation/views/SplitBillNewView';

export default function SplitBillNewPage() {
  return (
    <Suspense fallback={null}>
      <SplitBillNewView />
    </Suspense>
  );
}
