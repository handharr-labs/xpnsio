'use client';

import { useSplitBillNewViewModel } from './useSplitBillNewViewModel';
import { SplitBillFormView } from './SplitBillFormView';

export function SplitBillNewView() {
  const vm = useSplitBillNewViewModel();
  return <SplitBillFormView vm={vm} />;
}
