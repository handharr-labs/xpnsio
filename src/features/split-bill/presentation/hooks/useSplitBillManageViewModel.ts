'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import { getSplitBillAction, updateParticipantStatusAction, deleteSplitBillAction } from '../actions/split-bill';
import { useState } from 'react';

export function useSplitBillManageViewModel(billId: string) {
  const { executeAsync: fetchBill } = useAction(getSplitBillAction);
  const { executeAsync: updateStatus, isExecuting: isUpdating } = useAction(updateParticipantStatusAction);
  const { executeAsync: deleteBill, isExecuting: isDeleting } = useAction(deleteSplitBillAction);
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: bill, isPending: isLoading } = useQuery({
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

  const deleteBillById = async (onSuccess: () => void) => {
    setError(null);
    try {
      await deleteBill({ billId });
      queryClient.removeQueries({ queryKey: ['split-bill', billId] });
      queryClient.invalidateQueries({ queryKey: ['split-bills'] });
      onSuccess();
    } catch {
      setError('Failed to delete bill');
    }
  };

  return { bill, isLoading, isUpdating, isDeleting, error, approveParticipant, rejectParticipant, deleteBillById };
}
