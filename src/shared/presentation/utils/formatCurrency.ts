const LOCALES: Record<string, string> = {
  IDR: 'id-ID',
  USD: 'en-US',
  SGD: 'en-SG',
  MYR: 'ms-MY',
  EUR: 'de-DE',
};

export function getLocale(currency: string): string {
  return LOCALES[currency] ?? 'en-US';
}

export function formatCurrency(amount: number, currency: string = 'IDR'): string {
  const locale = getLocale(currency);
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

export function formatCompactCurrency(amount: number, currency: string = 'IDR'): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  let value: string;
  if (abs >= 1_000_000_000) value = `${(abs / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  else if (abs >= 1_000_000) value = `${(abs / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  else if (abs >= 1_000) value = `${(abs / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  else value = abs.toString();
  return `${sign}${value}`;
}
