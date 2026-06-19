import { LIMITS } from '@/constants/config';
import type { EntryDraft } from '@/types';

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates an entry draft before saving.
 * Rules: title is required and capped; note is optional but capped.
 */
export function validateEntry(draft: EntryDraft): ValidationResult {
  const errors: Record<string, string> = {};

  const title = draft.title?.trim() ?? '';
  if (title.length === 0) {
    errors.title = 'Title is required.';
  } else if (title.length > LIMITS.TITLE_MAX) {
    errors.title = `Title must be ${LIMITS.TITLE_MAX} characters or fewer.`;
  }

  if ((draft.note?.length ?? 0) > LIMITS.NOTE_MAX) {
    errors.note = `Note must be ${LIMITS.NOTE_MAX} characters or fewer.`;
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/** Validates a PIN used for the optional app lock. */
export function isValidPin(pin: string): boolean {
  return new RegExp(`^\\d{${LIMITS.PIN_LENGTH}}$`).test(pin);
}
