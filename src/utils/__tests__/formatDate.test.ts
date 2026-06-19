import { formatDate, formatDateTime } from '@/utils/formatDate';

describe('formatDate', () => {
  it('formats a timestamp as "D Mon YYYY"', () => {
    // Built from local time so the assertion is timezone-independent.
    const ts = new Date(2026, 5, 5, 14, 30).getTime(); // 5 June 2026
    expect(formatDate(ts)).toBe('5 Jun 2026');
  });

  it('uses the correct month abbreviation for January', () => {
    const ts = new Date(2025, 0, 1).getTime();
    expect(formatDate(ts)).toBe('1 Jan 2025');
  });

  it('formatDateTime appends a zero-padded time', () => {
    const ts = new Date(2026, 5, 5, 9, 5).getTime();
    expect(formatDateTime(ts)).toBe('5 Jun 2026, 09:05');
  });
});
