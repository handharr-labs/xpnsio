export function formatRelativeDate(dateStr: string, format: 'short' | 'long' = 'short'): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateStr === today.toISOString().split('T')[0]) return 'Today';
  if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';

  const date = new Date(dateStr);
  if (format === 'long') {
    return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
  }
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function formatFullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}
