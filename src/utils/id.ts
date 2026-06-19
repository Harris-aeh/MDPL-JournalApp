/**
 * Generates a reasonably unique id without pulling in an external uuid library.
 * Good enough for local, single-device entries.
 */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
