const LOCALES: Record<string, string> = {
  IDR: 'id-ID',
  USD: 'en-US',
  SGD: 'en-SG',
  MYR: 'ms-MY',
  EUR: 'de-DE',
};

export function formatCurrency(amount: number, currency: string = 'IDR'): string {
  const locale = LOCALES[currency] ?? 'en-US';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}
