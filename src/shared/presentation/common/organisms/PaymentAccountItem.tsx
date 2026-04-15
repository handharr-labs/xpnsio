'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface PaymentAccountItemProps {
  id: string;
  bankName: string;
  accountNumber: string;
}

export function PaymentAccountItem({ id, bankName, accountNumber }: PaymentAccountItemProps) {
  const [copied, setCopied] = useState(false);

  const copyAccount = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <p className="text-sm font-semibold">{bankName}</p>
        <p className="text-xs text-muted-foreground font-mono">{accountNumber}</p>
      </div>
      <button
        onClick={copyAccount}
        className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
