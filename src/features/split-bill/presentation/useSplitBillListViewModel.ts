'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSplitBillsAction } from './actions/split-bill';

export function useSplitBillListViewModel() {
  const queryClient = useQueryClient();

  const { data, isPending, status, fetchStatus, error } = useQuery({
    queryKey: ['split-bills'],
    queryFn: async () => {
      console.log('[split-bills-vm] queryFn called');
      const res = await getSplitBillsAction({});
      console.log('[split-bills-vm] queryFn result', { res, serverError: (res as any)?.serverError, data: res?.data });
      return res?.data ?? [];
    },
  });

  console.log('[split-bills-vm]', { isPending, status, fetchStatus, error, dataType: typeof data, isArray: Array.isArray(data), dataLength: Array.isArray(data) ? data.length : 'N/A' });

  return { bills: data ?? [], isLoading: isPending };
}
