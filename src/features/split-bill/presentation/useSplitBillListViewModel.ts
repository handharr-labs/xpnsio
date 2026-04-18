'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import { useState, useEffect } from 'react';
import { getSplitBillsAction } from './actions/split-bill';

export function useSplitBillListViewModel() {
  const { executeAsync: fetchBills } = useAction(getSplitBillsAction);
  const queryClient = useQueryClient();

  const { data: bills = [], status } = useQuery({
    queryKey: ['split-bills'],
    queryFn: async () => {
      const res = await fetchBills({});
      return res?.data ?? [];
    },
  });

  const [isLoading, setIsLoading] = useState(status === 'pending');

  useEffect(() => {
    if (status !== 'pending') setIsLoading(false);
  }, [status]);

  return { bills, isLoading };
}
