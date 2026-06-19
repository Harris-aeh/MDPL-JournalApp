/** Location attached to an entry (resolved from the device GPS). */
export interface EntryLocation {
  latitude: number;
  longitude: number;
  /** Human-readable address from reverse geocoding (optional). */
  address?: string;
}

/** A single journal entry. */
export interface Entry {
  id: string;
  title: string;
  note: string;
  /** Local file URI of an attached photo, if any. */
  photoUri?: string;
  location?: EntryLocation;
  /** Unix timestamp (ms) of when the entry was created. */
  createdAt: number;
}

/** Shape used by the create/edit form before it becomes an Entry. */
export interface EntryDraft {
  title: string;
  note: string;
  photoUri?: string;
  location?: EntryLocation;
}
