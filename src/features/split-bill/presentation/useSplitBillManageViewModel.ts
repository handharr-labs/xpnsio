'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import { getSplitBillAction, updateParticipantStatusAction } from './actions/split-bill';
import { useState } from 'react';

export function useSplitBillManageViewModel(billId: string) {
  const { executeAsync: fetchBill } = useAction(getSplitBillAction);
  const { executeAsync: updateStatus, isExecuting: isUpdating } = useAction(updateParticipantStatusAction);
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: bill, isLoading } = useQuery({
    queryKey: ['split-bill', billId],
    queryFn: async () => {
      const res = await fetchBill({ id: billId });
      return res?.data ?? null;
    },
  });

  const approveParticipant = async (participantId: string) => {
    setError(null);
    try {
      await updateStatus({ participantId, status: 'approved' });
      queryClient.invalidateQueries({ queryKey: ['split-bill', billId] });
    } catch {
      setError('Failed to approve participant');
    }
  };

  const rejectParticipant = async (participantId: string) => {
    setError(null);
    try {
      await updateStatus({ participantId, status: 'rejected' });
      queryClient.invalidateQueries({ queryKey: ['split-bill', billId] });
    } catch {
      setError('Failed to reject participant');
    }
  };

  return { bill, isLoading, isUpdating, error, approveParticipant, rejectParticipant };
}
