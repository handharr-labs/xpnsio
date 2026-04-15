'use client';

import { useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import { Upload, X, ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTripDetailPublicAction, uploadTripSettlementProofAction } from '../actions/trips';
import { formatCurrency } from '@/shared/presentation/utils/formatCurrency';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { PaymentAccountList } from '@/shared/presentation/common/organisms/PaymentAccountList';
import { PublicParticipantCard } from '@/shared/presentation/common/organisms/PublicParticipantCard';
import type { TripParticipantSettlement } from '../../domain/entities/TripParticipantSettlement';

export function TripPublicView({ tripId }: { tripId: string }) {
  const { executeAsync: fetchTrip } = useAction(getTripDetailPublicAction);
  const { executeAsync: submitProof, isExecuting: isUploading } = useAction(
    uploadTripSettlementProofAction
  );
  const queryClient = useQueryClient();

  const [selectedSettlement, setSelectedSettlement] = useState<TripParticipantSettlement | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: tripDetail, isLoading } = useQuery({
    queryKey: ['trip-public', tripId],
    queryFn: async () => {
      const res = await fetchTrip({ tripId });
      return res?.data ?? null;
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setLocalError('File too large. Max 5MB.');
      return;
    }
    setProofFile(file);
    setLocalError(null);
    setProofPreview(URL.createObjectURL(file));
  };

  const handleSubmitProof = async () => {
    if (!selectedSettlement || !proofFile) return;
    setUploadError(null);
    setLocalError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const ext = proofFile.name.split('.').pop() ?? 'jpg';
      const path = `trips/${tripId}/${selectedSettlement.id}-${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from('payment-proofs')
        .upload(path, proofFile, { upsert: false });

      if (uploadErr) throw new Error(uploadErr.message);

      const { data: urlData } = supabase.storage.from('payment-proofs').getPublicUrl(path);
      const proofImageUrl = urlData.publicUrl;

      await submitProof({ settlementId: selectedSettlement.id, proofImageUrl });
      queryClient.invalidateQueries({ queryKey: ['trip-public', tripId] });
      setUploadSuccess(true);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const closeModal = () => {
    setSelectedSettlement(null);
    setProofFile(null);
    setProofPreview(null);
    setLocalError(null);
    setUploadError(null);
    setUploadSuccess(false);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen px-4 pt-8 max-w-sm mx-auto space-y-4">
        <div className="h-7 w-48 bg-muted rounded-xl animate-pulse" />
        <div className="h-4 w-32 bg-muted rounded-xl animate-pulse" />
        <div className="space-y-3 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  if (!tripDetail) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="text-muted-foreground text-center">Trip not found or has expired.</p>
      </main>
    );
  }

  const { trip, settlements, bills } = tripDetail;
  const startDateLabel = trip.startDate instanceof Date
    ? trip.startDate.toISOString().split('T')[0]
    : String(trip.startDate);
  const endDateLabel = trip.endDate instanceof Date
    ? trip.endDate.toISOString().split('T')[0]
    : trip.endDate
      ? String(trip.endDate)
      : null;
  const dateLabel = endDateLabel ? `${startDateLabel} → ${endDateLabel}` : startDateLabel;

  // Get unique payment accounts across all bills and find creator name
  const uniqueAccounts = new Map<string, { id: string; bankName: string; accountNumber: string }>();
  let creatorName = '';

  bills.forEach((bill) => {
    bill.accounts.forEach((acc) => {
      const key = `${acc.bankName}-${acc.accountNumber}`;
      if (!uniqueAccounts.has(key)) {
        uniqueAccounts.set(key, acc);
      }
    });

    // Find creator from participants — prefer a non-"you" name (i.e. already resolved)
    const creator = bill.participants.find((p) => p.isCreator);
    if (creator && !creatorName) {
      creatorName = creator.name;
    }
  });

  // Resolve the display name for a settlement — handles legacy "you" entries stored
  // before the creator-name fix, replacing them with the actual creator name.
  const resolveDisplayName = (participantName: string): string => {
    if (participantName.toLowerCase() === 'you' && creatorName) {
      return creatorName;
    }
    return participantName;
  };

  const allPaymentAccounts = Array.from(uniqueAccounts.values());

  return (
    <>
      <main className="min-h-screen">
        <div className="px-4 pt-8 pb-12 max-w-sm mx-auto space-y-6">
          {/* Trip header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{trip.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">{dateLabel}</p>
            {trip.description && (
              <p className="text-sm text-muted-foreground">{trip.description}</p>
            )}
          </div>

          {/* Payment accounts — shared across all bills */}
          {allPaymentAccounts.length > 0 && (
            <PaymentAccountList
              label={`Pay to ${creatorName || 'the creator'}`}
              accounts={allPaymentAccounts}
            />
          )}

          {/* Bills summary */}
          {bills.length > 0 && (
            <div className='space-y-3'>
              <p className='text-sm font-semibold'>Bills in this trip</p>
              {bills.map((bill) => {
                const billTotal = bill.participants.reduce((s, p) => s + p.finalAmount, 0);
                return (
                  <div key={bill.id} className='rounded-2xl bg-muted/50 ring-1 ring-border p-4 space-y-3'>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='font-medium truncate'>{bill.title}</span>
                      <span className='font-semibold ml-2'>{formatCurrency(billTotal, 'IDR')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Settlements — participant selection */}
          <div className="space-y-2">
            <p className="text-sm font-semibold">Select yourself to upload payment proof</p>

            {settlements.length === 0 && (
              <p className="text-sm text-muted-foreground">No settlements yet.</p>
            )}

            {settlements.map((s) => {
              const displayName = resolveDisplayName(s.participantName);
              const isCreatorRow = s.participantName.toLowerCase() === 'you'
                || (creatorName !== '' && displayName.toLowerCase() === creatorName.toLowerCase());

              // Per-bill breakdown rendered as children
              const perBillBreakdown = bills.length > 0 ? (
                <div className="mt-3 space-y-1">
                  {bills.map((bill) => {
                    const participant = bill.participants.find(
                      (p) => p.name.toLowerCase() === s.participantName.toLowerCase()
                        || p.name.toLowerCase() === displayName.toLowerCase()
                    );
                    if (!participant) return null;
                    return (
                      <div key={bill.id} className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="truncate">{bill.title}</span>
                        <span className="ml-2">{formatCurrency(participant.finalAmount, 'IDR')}</span>
                      </div>
                    );
                  })}
                </div>
              ) : null;

              return (
                <PublicParticipantCard
                  key={s.id}
                  name={displayName}
                  amount={s.totalNetAmount}
                  isCreator={isCreatorRow}
                  creatorBadgeLabel="Trip creator"
                  status={s.status}
                  email={s.participantEmail ?? undefined}
                  onSelectSelf={!isCreatorRow ? () => setSelectedSettlement(s) : undefined}
                >
                  {perBillBreakdown}
                </PublicParticipantCard>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            Not on the list? Ask the trip creator to add you.
          </p>
        </div>
      </main>

      {/* Upload proof modal */}
      {selectedSettlement && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-background w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5 space-y-5 max-h-[90vh] overflow-y-auto">

            {/* Loading state */}
            {isUploading && (
              <div className="flex flex-col items-center justify-center py-10 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Uploading your proof…</p>
              </div>
            )}

            {/* Success state */}
            {!isUploading && uploadSuccess && (
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-semibold text-lg">Proof submitted!</p>
                  <p className="text-sm text-muted-foreground">
                    The trip creator will review and approve your payment.
                  </p>
                </div>
                <Button className="w-full h-12 rounded-xl mt-2" onClick={closeModal}>
                  Done
                </Button>
              </div>
            )}

            {/* Upload form */}
            {!isUploading && !uploadSuccess && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg">Upload payment proof</h2>
                  <button
                    onClick={closeModal}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Settlement summary */}
                <div className="rounded-xl bg-muted/50 ring-1 ring-border p-3 space-y-1">
                  <p className="font-medium">{resolveDisplayName(selectedSettlement.participantName)}</p>
                  <p className="text-sm font-semibold text-primary">
                    {formatCurrency(selectedSettlement.totalNetAmount, 'IDR')}
                  </p>
                </div>

                {/* File upload */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Attach proof (JPG/PNG, max 5MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {proofPreview ? (
                    <div className="relative rounded-xl overflow-hidden ring-1 ring-border">
                      <img src={proofPreview} alt="Preview" className="w-full max-h-48 object-cover" />
                      <button
                        onClick={() => { setProofFile(null); setProofPreview(null); }}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-sm">Tap to select image</span>
                    </button>
                  )}
                </div>

                {(localError || uploadError) && (
                  <p className="text-sm text-red-600 dark:text-red-400">{localError ?? uploadError}</p>
                )}

                <Button
                  className="w-full h-12 rounded-xl gap-2"
                  disabled={!proofFile}
                  onClick={handleSubmitProof}
                >
                  <Upload className="w-4 h-4" />
                  Submit proof
                </Button>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}
