'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface ShareLinkRowProps {
  url: string;
  href: string;
}

export function ShareLinkRow({ url, href }: ShareLinkRowProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-muted/50 ring-1 ring-border p-4 space-y-2">
      <p className="text-sm font-medium">Share with participants</p>
      <div className="flex gap-2">
        <input
          readOnly
          value={url}
          className="flex-1 min-w-0 h-10 px-3 rounded-xl bg-background ring-1 ring-border text-sm text-muted-foreground focus:outline-none"
        />
        <button
          onClick={copyLink}
          className="h-10 px-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="h-10 w-10 shrink-0 rounded-xl bg-muted ring-1 ring-border flex items-center justify-center"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
