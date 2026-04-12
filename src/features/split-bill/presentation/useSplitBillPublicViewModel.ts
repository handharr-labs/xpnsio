'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import { getSplitBillPublicAction, uploadPaymentProofAction } from './actions/split-bill';
import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

export function useSplitBillPublicViewModel(billId: string) {
  const { executeAsync: fetchBill } = useAction(getSplitBillPublicAction);
  const { executeAsync: submitProof, isExecuting: isUploading } = useAction(uploadPaymentProofAction);
  const queryClient = useQueryClient();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { data: bill, isLoading } = useQuery({
    queryKey: ['split-bill-public', billId],
    queryFn: async () => {
      const res = await fetchBill({ id: billId });
      return res?.data ?? null;
    },
  });

  const uploadProof = async (participantId: string, file: File, email?: string) => {
    setUploadError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `${billId}/${participantId}-${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from('payment-proofs')
        .upload(path, file, { upsert: false });

      if (uploadErr) throw new Error(uploadErr.message);

      const { data: urlData } = supabase.storage.from('payment-proofs').getPublicUrl(path);
      const imageUrl = urlData.publicUrl;

      await submitProof({ participantId, imageUrl });
      queryClient.invalidateQueries({ queryKey: ['split-bill-public', billId] });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    }
  };

  return { bill, isLoading, isUploading, uploadError, uploadProof };
}
