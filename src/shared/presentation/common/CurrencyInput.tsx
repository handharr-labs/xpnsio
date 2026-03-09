'use client';

import { useState, useRef, useEffect } from 'react';

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
  const [display, setDisplay] = useState(() => formatAmount(value, currency));
  const isFocusedRef = useRef(false);
  const lastValueRef = useRef(value);

  // Update display when value changes from outside (not during user typing)
  useEffect(() => {
    if (!isFocusedRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(value > 0 ? formatAmount(value, currency) : '');
      lastValueRef.current = value;
    } else if (value !== lastValueRef.current) {
      // Value changed while focused (e.g., parent reset), update display
      setDisplay(value > 0 ? formatAmount(value, currency) : '');
      lastValueRef.current = value;
    }
  }, [currency, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = parseAmount(e.target.value);
    setDisplay(numeric > 0 ? formatAmount(numeric, currency) : '');
    lastValueRef.current = numeric;
    onChange(numeric);
  };

  const handleFocus = () => {
    isFocusedRef.current = true;
  };

  const handleBlur = () => {
    isFocusedRef.current = false;
    // Re-sync with value prop on blur
    setDisplay(value > 0 ? formatAmount(value, currency) : '');
  };

  return (
    <div className={`flex items-center border rounded-md ${className}`}>
      <span
        className="px-3 py-2 bg-muted text-sm border-r text-muted-foreground font-medium min-w-[3.5rem] text-center flex-shrink-0"
      >
        {currency}
      </span>
      <input
        type="text"
        inputMode="numeric"
        className="flex-1 min-w-0 px-3 py-2 text-sm outline-none bg-background"
        value={display}
        placeholder={placeholder}
        required={required}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
}
