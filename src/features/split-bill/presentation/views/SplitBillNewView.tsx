'use client';

import { useSplitBillNewViewModel } from '../hooks/useSplitBillNewViewModel';
import { SplitBillFormView } from './SplitBillFormView';

export function SplitBillNewView() {
  const vm = useSplitBillNewViewModel();
  return <SplitBillFormView vm={vm} />;
}
