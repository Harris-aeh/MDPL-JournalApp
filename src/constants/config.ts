/** App-wide constants. */
export const STORAGE_KEYS = {
  ENTRIES: 'fieldnotes.entries.v1',
} as const;

export const SECURE_KEYS = {
  PIN: 'fieldnotes.pin',
  LOCK_ENABLED: 'fieldnotes.lockEnabled',
} as const;

export const LIMITS = {
  TITLE_MAX: 60,
  NOTE_MAX: 500,
  PIN_LENGTH: 4,
} as const;
