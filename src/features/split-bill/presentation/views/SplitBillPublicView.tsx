'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Upload, X, ImageIcon, Luggage } from 'lucide-react';
import { Button, CopyRowList, StatusCard } from '@handharr-labs/ui-xpnsio';
import { formatCurrency } from '@handharr-labs/core';
import { ROUTES } from '@/shared/presentation/navigation/routes';
import { useSplitBillPublicViewModel } from '../hooks/useSplitBillPublicViewModel';
import type { SplitBillParticipant } from '../../domain/entities/SplitBillParticipant';

export function SplitBillPublicView({ billId }: { billId: string }) {
  const { bill, isLoading, isUploading, uploadError, uploadProof } =
    useSplitBillPublicViewModel(billId);
  const [selectedParticipant, setSelectedParticipant] = useState<SplitBillParticipant | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!selectedParticipant || !proofFile) return;
    setLocalError(null);
    try {
      await uploadProof(selectedParticipant.id, proofFile, email || undefined);
      setSelectedParticipant(null);
      setProofFile(null);
      setProofPreview(null);
      setEmail('');
    } catch {
      // error surfaced via uploadError
    }
  };

  const closeModal = () => {
    setSelectedParticipant(null);
    setProofFile(null);
    setProofPreview(null);
    setEmail('');
    setLocalError(null);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen px-4 pt-8 max-w-sm mx-auto space-y-4">
        <div className="h-7 w-48 bg-muted rounded-xl animate-pulse" />
        <div className="h-4 w-32 bg-muted rounded-xl animate-pulse" />
        <div className="space-y-3 mt-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 w-full rounded-2xl bg-muted animate-pulse" />)}
        </div>
      </main>
    );
  }

  if (!bill) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="text-muted-foreground text-center">Bill not found or has expired.</p>
      </main>
    );
  }

  if (bill.tripId) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto">
            <Luggage className="w-7 h-7 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="typo-page-title">This bill is part of a trip</h1>
            <p className="text-sm text-muted-foreground">
              Paying here only settles this individual bill. To see and pay the full trip total, visit the trip page.
            </p>
          </div>
          <Link
            href={ROUTES.tripPublic(bill.tripId)}
            className="inline-block w-full rounded-xl bg-primary text-primary-foreground px-4 py-2 text-center text-sm font-medium"
          >
            View trip page
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen">
        <div className="px-4 pt-8 pb-12 max-w-sm mx-auto space-y-6">
          {/* Bill header */}
          <div>
            <h1 className="typo-page-title">{bill.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{bill.date}</p>
            {bill.description && <p className="text-sm text-muted-foreground">{bill.description}</p>}
          </div>

          {/* Payment accounts */}
          <CopyRowList
            label="Pay to"
            accounts={bill.accounts.map((acc) => ({
              id: acc.id,
              bankName: acc.bankName,
              accountNumber: acc.accountNumber,
            }))}
          />

          {/* Participants */}
          <div className="space-y-2">
            <p className="text-sm font-semibold">Who needs to pay</p>
            {bill.participants.map((p) => (
              <StatusCard
                key={p.id}
                name={p.name}
                formattedAmount={formatCurrency(p.finalAmount, 'IDR')}
                variant={p.isCreator || p.status === 'approved' ? 'success' : p.status === 'proof_uploaded' ? 'warning' : p.status === 'rejected' ? 'danger' : 'default'}
                statusLabel={p.isCreator ? 'Paid' : p.status === 'proof_uploaded' ? 'Proof submitted — awaiting approval' : p.status === 'approved' ? 'Paid' : p.status === 'rejected' ? 'Proof rejected — contact the creator' : undefined}
                badge={p.isCreator ? 'Bill creator' : undefined}
                actionButton={!p.isCreator && p.status === 'pending' ? { label: `I'm ${p.name}`, onClick: () => setSelectedParticipant(p) } : undefined}
              />
            ))}
          </div>

          {/* Not on the list */}
          <p className="text-xs text-muted-foreground text-center pt-2">
            Not on the list? Ask the bill creator to add you.
          </p>
        </div>
      </main>

      {/* Upload modal */}
      {selectedParticipant && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-background w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Upload payment proof</h2>
              <button onClick={closeModal} className="w-9 h-9 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Summary */}
            <div className="rounded-xl bg-muted/50 ring-1 ring-border p-3 space-y-1">
              <p className="font-medium">{selectedParticipant.name}</p>
              <p className="text-sm font-semibold text-primary">{formatCurrency(selectedParticipant.finalAmount, 'IDR')}</p>
            </div>

            {/* Pay to (inline) */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Transfer to</p>
              {bill.accounts.map((acc) => (
                <div key={acc.id} className="flex items-center justify-between rounded-xl bg-muted/50 ring-1 ring-border px-3 py-2.5">
                  <span className="text-sm"><strong>{acc.bankName}</strong> · <span className="font-mono">{acc.accountNumber}</span></span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(acc.accountNumber);
                      setCopiedAccount(acc.id);
                      setTimeout(() => setCopiedAccount(null), 2000);
                    }}
                    className="text-xs font-medium text-primary hover:underline min-h-[44px] flex items-center gap-1 px-2"
                  >
                    {copiedAccount === acc.id ? 'Copied' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>

            {/* File upload */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Attach proof (JPG/PNG, max 5MB)</p>
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

            {/* Email */}
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-2">
                Email <span className="font-normal">(optional)</span>
              </label>
              <input
                type="email"
                className="w-full h-11 px-4 rounded-xl bg-muted/50 ring-1 ring-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                We collect your email only to connect your payment history if you ever create an account — never for promotions.
              </p>
            </div>

            {(localError || uploadError) && (
              <p className="text-sm text-red-600 dark:text-red-400">{localError ?? uploadError}</p>
            )}

            <Button
              className="w-full h-12 rounded-xl gap-2"
              disabled={!proofFile || isUploading}
              onClick={handleSubmitProof}
            >
              <Upload className="w-4 h-4" />
              {isUploading ? 'Uploading...' : 'Submit proof'}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
