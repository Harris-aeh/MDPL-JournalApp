import { useContext } from 'react';

import { EntriesContext } from '@/context/EntriesContext';

/** Typed accessor for the entries context that fails loudly if used outside the provider. */
export function useEntries() {
  const context = useContext(EntriesContext);
  if (!context) {
    throw new Error('useEntries must be used within an EntriesProvider');
  }
  return context;
}
