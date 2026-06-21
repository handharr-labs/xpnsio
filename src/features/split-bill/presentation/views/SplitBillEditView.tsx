'use client';

import { useSplitBillEditViewModel } from '../hooks/useSplitBillEditViewModel';
import { SplitBillFormView } from './SplitBillFormView';

export function SplitBillEditView({ billId }: { billId: string }) {
  const vm = useSplitBillEditViewModel(billId);
  return <SplitBillFormView vm={vm} />;
}
