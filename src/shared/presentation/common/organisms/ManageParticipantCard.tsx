'use client';

import { ImageIcon } from 'lucide-react';
import { formatCurrency } from '@/shared/presentation/utils/formatCurrency';
import { ProofActionsRow } from './ProofActionsRow';

type ParticipantStatus = 'pending' | 'proof_uploaded' | 'approved' | 'rejected';

const STATUS_STYLES: Record<ParticipantStatus, string> = {
  pending: 'bg-muted text-muted-foreground',
  proof_uploaded: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  approved: 'bg-green-500/10 text-green-700 dark:text-green-400',
  rejected: 'bg-red-500/10 text-red-700 dark:text-red-400',
};

const STATUS_LABEL: Record<ParticipantStatus, string> = {
  pending: 'Pending',
  proof_uploaded: 'Proof uploaded',
  approved: 'Approved',
  rejected: 'Rejected',
};

interface ManageParticipantCardProps {
  name: string;
  amount: number;
  status: ParticipantStatus;
  isCreator?: boolean;
  creatorBadgeLabel?: string;
  proofImageUrl?: string | null;
  isUpdating?: boolean;
  onViewProof?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

export function ManageParticipantCard({
  name,
  amount,
  status,
  isCreator = false,
  creatorBadgeLabel = 'Creator',
  proofImageUrl,
  isUpdating = false,
  onViewProof,
  onApprove,
  onReject,
}: ManageParticipantCardProps) {
  const displayStatus: ParticipantStatus = isCreator ? 'approved' : status;

  return (
    <div className="rounded-xl ring-1 ring-border p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold flex items-center gap-2">
            {name}
            {isCreator && (
              <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-medium">
                {creatorBadgeLabel}
              </span>
            )}
          </p>
          <p className="text-sm font-medium text-primary">{formatCurrency(amount, 'IDR')}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[displayStatus]}`}>
          {STATUS_LABEL[displayStatus]}
        </span>
      </div>

      {proofImageUrl && onViewProof && (
        <button
          onClick={onViewProof}
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ImageIcon className="w-4 h-4" /> View proof
        </button>
      )}

      {status === 'proof_uploaded' && onApprove && onReject && !isCreator && (
        <ProofActionsRow
          isUpdating={isUpdating}
          onApprove={onApprove}
          onReject={onReject}
        />
      )}
    </div>
  );
}
