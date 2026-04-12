'use client';

import { useState, useRef } from 'react';
import { Copy, Check, Upload, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSplitBillPublicViewModel } from './useSplitBillPublicViewModel';
import { formatCurrency } from '@/shared/presentation/utils/formatCurrency';
import type { SplitBillParticipant, ParticipantStatus } from '../domain/entities/SplitBillParticipant';

const STATUS_STYLES: Record<ParticipantStatus, string> = {
  pending: '',
  proof_uploaded: 'bg-yellow-500/10 ring-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  approved: 'bg-green-500/10 ring-green-500/20 text-green-700 dark:text-green-400',
  rejected: 'bg-red-500/10 ring-red-500/20 text-red-700 dark:text-red-400',
};

const STATUS_LABEL: Record<ParticipantStatus, string> = {
  pending: '',
  proof_uploaded: 'Proof submitted — awaiting approval',
  approved: 'Paid',
  rejected: 'Proof rejected — contact the bill creator',
};

export function SplitBillPublicView({ billId }: { billId: string }) {
  const { bill, isLoading, isUploading, uploadError, uploadProof } =
    useSplitBillPublicViewModel(billId);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<SplitBillParticipant | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const copyAccount = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(id);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

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
          {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-2xl bg-muted animate-pulse" />)}
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

  return (
    <>
      <main className="min-h-screen">
        <div className="px-4 pt-8 pb-12 max-w-sm mx-auto space-y-6">
          {/* Bill header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{bill.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{bill.date}</p>
            {bill.description && <p className="text-sm text-muted-foreground">{bill.description}</p>}
          </div>

          {/* Payment accounts */}
          <div className="rounded-2xl bg-muted/50 ring-1 ring-border p-4 space-y-3">
            <p className="text-sm font-semibold">Pay to</p>
            {bill.accounts.map((acc) => (
              <div key={acc.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{acc.bankName}</p>
                  <p className="font-mono text-sm">{acc.accountNumber}</p>
                </div>
                <button
                  onClick={() => copyAccount(acc.accountNumber, acc.id)}
                  className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline min-h-[44px] px-2"
                >
                  {copiedAccount === acc.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedAccount === acc.id ? 'Copied!' : 'Copy'}
                </button>
              </div>
            ))}
          </div>

          {/* Participants */}
          <div className="space-y-2">
            <p className="text-sm font-semibold">Who needs to pay</p>
            {bill.participants.map((p) => (
              <div
                key={p.id}
                className={`rounded-xl ring-1 p-4 ${p.status === 'pending' ? 'ring-border' : STATUS_STYLES[p.status]}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm font-medium">{formatCurrency(p.finalAmount, 'IDR')}</p>
                  </div>
                  {p.status === 'pending' && (
                    <button
                      onClick={() => setSelectedParticipant(p)}
                      className="text-sm font-medium text-primary hover:underline min-h-[44px] flex items-center"
                    >
                      I'm {p.name}
                    </button>
                  )}
                  {p.status !== 'pending' && (
                    <span className="text-xs font-medium">{STATUS_LABEL[p.status]}</span>
                  )}
                </div>
              </div>
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
                    onClick={() => copyAccount(acc.accountNumber, acc.id)}
                    className="text-xs font-medium text-primary hover:underline min-h-[44px] flex items-center gap-1 px-2"
                  >
                    {copiedAccount === acc.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy
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
