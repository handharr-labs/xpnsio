'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import { useState, useEffect } from 'react';
import { getSplitBillsAction } from './actions/split-bill';

const t = () => new Date().toISOString();

export function useSplitBillListViewModel() {
  const { executeAsync: fetchBills } = useAction(getSplitBillsAction);
  const queryClient = useQueryClient();

  const { data: bills = [], status } = useQuery({
    queryKey: ['split-bills'],
    queryFn: async () => {
      console.log(`[SplitBillList][${t()}] queryFn called`);
      const res = await fetchBills({});
      console.log(`[SplitBillList][${t()}] queryFn resolved, data length:`, res?.data?.length ?? 0);
      return res?.data ?? [];
    },
  });

  const initialStatus = status;
  const [isLoading, setIsLoading] = useState(() => {
    console.log(`[SplitBillList][${t()}] useState init — status:`, initialStatus);
    return initialStatus === 'pending';
  });

  console.log(`[SplitBillList][${t()}] render — status:`, status, '| isLoading:', isLoading, '| bills:', bills.length);

  useEffect(() => {
    console.log(`[SplitBillList][${t()}] useEffect status change:`, status, '| setting isLoading:', status === 'pending');
    if (status !== 'pending') setIsLoading(false);
  }, [status]);

  return { bills, isLoading };
}
