import { isValidPin, validateEntry } from '@/utils/validation';

describe('validateEntry', () => {
  it('accepts a valid draft', () => {
    const result = validateEntry({ title: 'A walk in the park', note: 'Lovely day' });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('rejects an empty title', () => {
    const result = validateEntry({ title: '   ', note: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.title).toBeDefined();
  });

  it('rejects a title that is too long', () => {
    const result = validateEntry({ title: 'x'.repeat(61), note: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.title).toBeDefined();
  });

  it('rejects a note that exceeds the limit', () => {
    const result = validateEntry({ title: 'Ok', note: 'y'.repeat(501) });
    expect(result.valid).toBe(false);
    expect(result.errors.note).toBeDefined();
  });
});

describe('isValidPin', () => {
  it('accepts a 4-digit PIN', () => {
    expect(isValidPin('1234')).toBe(true);
  });

  it('rejects PINs that are the wrong length or contain non-digits', () => {
    expect(isValidPin('123')).toBe(false);
    expect(isValidPin('12a4')).toBe(false);
  });
});
