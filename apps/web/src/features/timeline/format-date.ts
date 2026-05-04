const WEEKDAYS = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
];

/**
 * Human-friendly relative date for timeline rows.
 * - today, hh:mm
 * - gestern, hh:mm
 * - Weekday, hh:mm (within last 7 days)
 * - DD.MM.YYYY, hh:mm (older)
 */
export function formatRelativeDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const time = `${hh}:${mm}`;

  if (isSameDay(date, now)) return `heute, ${time}`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) return `gestern, ${time}`;

  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    const weekdayIdx = date.getDay();
    const weekday = WEEKDAYS[weekdayIdx] ?? '';
    return `${weekday}, ${time}`;
  }

  const dd = String(date.getDate()).padStart(2, '0');
  const mo = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mo}.${date.getFullYear()}, ${time}`;
}
