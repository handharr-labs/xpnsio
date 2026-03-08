'use client';

import { useState, useEffect } from 'react';

const LOCALES: Record<string, string> = {
  IDR: 'id-ID',
  USD: 'en-US',
  SGD: 'en-SG',
  MYR: 'ms-MY',
  EUR: 'de-DE',
};

function formatAmount(value: number, currency: string): string {
  if (value === 0) return '';
  const locale = LOCALES[currency] ?? 'en-US';
  return value.toLocaleString(locale);
}

function parseAmount(raw: string): number {
  const digits = raw.replace(/\D/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  currency?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function CurrencyInput({
  value,
  onChange,
  currency = 'IDR',
  placeholder = '0',
  className = '',
  required,
}: CurrencyInputProps) {
  const [display, setDisplay] = useState(formatAmount(value, currency));

  // Reformat when currency changes
  useEffect(() => {
    setDisplay(value > 0 ? formatAmount(value, currency) : '');
  }, [currency]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = parseAmount(e.target.value);
    setDisplay(numeric > 0 ? formatAmount(numeric, currency) : '');
    onChange(numeric);
  };

  return (
    <div className={`flex items-center border rounded-md overflow-hidden ${className}`}>
      <span className="px-3 py-2 bg-muted text-sm border-r text-muted-foreground font-medium min-w-[3.5rem] text-center">
        {currency}
      </span>
      <input
        type="text"
        inputMode="numeric"
        className="flex-1 px-3 py-2 text-sm outline-none bg-background"
        value={display}
        placeholder={placeholder}
        required={required}
        onChange={handleChange}
      />
    </div>
  );
}
