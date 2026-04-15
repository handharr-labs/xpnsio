'use client';

import { formatCurrency } from '@/shared/presentation/utils/formatCurrency';

type ParticipantStatus = 'pending' | 'proof_uploaded' | 'approved' | 'rejected';

interface PublicParticipantCardProps {
  name: string;
  amount: number;
  isCreator: boolean;
  creatorBadgeLabel: string;
  status: ParticipantStatus;
  email?: string;
  onSelectSelf?: () => void;
  children?: React.ReactNode;
}

export function PublicParticipantCard({
  name,
  amount,
  isCreator,
  creatorBadgeLabel,
  status,
  email,
  onSelectSelf,
  children,
}: PublicParticipantCardProps) {
  if (isCreator) {
    return (
      <div className="rounded-xl ring-1 ring-green-500/20 bg-green-500/10 p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold flex items-center gap-2 text-green-500 dark:text-green-400">
              {name}
              <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-medium">
                {creatorBadgeLabel}
              </span>
            </p>
            {email && <p className="text-xs text-muted-foreground">{email}</p>}
            <p className="text-sm font-medium text-green-500 dark:text-green-400">
              {formatCurrency(amount, 'IDR')}
            </p>
          </div>
          <span className="text-xs font-medium text-green-500 dark:text-green-400">Paid</span>
        </div>
        {children && <div>{children}</div>}
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="rounded-xl ring-1 ring-border p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold capitalize">{name}</p>
            {email && <p className="text-xs text-muted-foreground">{email}</p>}
            <p className="text-sm font-medium">{formatCurrency(amount, 'IDR')}</p>
          </div>
          {onSelectSelf && (
            <button
              onClick={onSelectSelf}
              className="text-sm font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors min-h-[44px] flex items-center"
            >
              I'm {name}
            </button>
          )}
        </div>
        {children && <div>{children}</div>}
      </div>
    );
  }

  if (status === 'proof_uploaded') {
    return (
      <div className="rounded-xl ring-1 ring-yellow-500/20 bg-yellow-500/10 p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold capitalize">{name}</p>
            {email && <p className="text-xs text-muted-foreground">{email}</p>}
            <p className="text-sm font-medium">{formatCurrency(amount, 'IDR')}</p>
          </div>
          <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
            Proof submitted — awaiting approval
          </span>
        </div>
        {children && <div>{children}</div>}
      </div>
    );
  }

  if (status === 'approved') {
    return (
      <div className="rounded-xl ring-1 ring-green-500/20 bg-green-500/10 p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold capitalize">{name}</p>
            {email && <p className="text-xs text-muted-foreground">{email}</p>}
            <p className="text-sm font-medium">{formatCurrency(amount, 'IDR')}</p>
          </div>
          <span className="text-xs font-medium text-green-700 dark:text-green-400">Paid</span>
        </div>
        {children && <div>{children}</div>}
      </div>
    );
  }

  // rejected
  return (
    <div className="rounded-xl ring-1 ring-red-500/20 bg-red-500/10 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold capitalize">{name}</p>
          {email && <p className="text-xs text-muted-foreground">{email}</p>}
          <p className="text-sm font-medium">{formatCurrency(amount, 'IDR')}</p>
        </div>
        <span className="text-xs font-medium text-red-700 dark:text-red-400">
          Proof rejected — contact the creator
        </span>
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}
