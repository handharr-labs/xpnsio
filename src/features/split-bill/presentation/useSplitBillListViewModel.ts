'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import { getSplitBillsAction } from './actions/split-bill';

export function useSplitBillListViewModel() {
  const { executeAsync: fetchBills } = useAction(getSplitBillsAction);
  const queryClient = useQueryClient();

  const { data: bills = [], isPending } = useQuery({
    queryKey: ['split-bills'],
    queryFn: async () => {
      const res = await fetchBills({});
      return res?.data ?? [];
    },
  });

  return { bills, isLoading: isPending };
}
