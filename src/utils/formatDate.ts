/**
 * Formats a Unix timestamp (ms) as a short, readable date string, e.g. "5 Jun 2026".
 * Kept pure (no Date.now / locale surprises) so it is easy to unit test.
 */
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/** Formats a timestamp with the time included, e.g. "5 Jun 2026, 14:30". */
export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${formatDate(timestamp)}, ${hours}:${minutes}`;
}
