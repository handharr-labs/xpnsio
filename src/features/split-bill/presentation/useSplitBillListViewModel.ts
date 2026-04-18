'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSplitBillsAction } from './actions/split-bill';

export function useSplitBillListViewModel() {
  const queryClient = useQueryClient();

  const { data: bills = [], isPending } = useQuery({
    queryKey: ['split-bills'],
    queryFn: async () => {
      const res = await getSplitBillsAction({});
      return res?.data ?? [];
    },
  });

  return { bills, isLoading: isPending };
}
