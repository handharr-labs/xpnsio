export function formatWeekRange(weekStartStr: string | undefined): string {
  if (!weekStartStr) return '';
  const start = new Date(weekStartStr);
  const end = new Date(weekStartStr);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return `${fmt(start)} – ${fmt(end)}`;
}
