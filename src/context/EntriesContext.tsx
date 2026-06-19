import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

import { loadEntries, saveEntries } from '@/services/storage';
import { generateId } from '@/utils/id';
import type { Entry, EntryDraft } from '@/types';
import {
  entriesReducer,
  initialEntriesState,
  type EntriesState,
} from './entriesReducer';

interface EntriesContextValue extends EntriesState {
  addEntry: (draft: EntryDraft) => Promise<Entry>;
  updateEntry: (entry: Entry) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getEntry: (id: string) => Entry | undefined;
  reload: () => Promise<void>;
}

export const EntriesContext = createContext<EntriesContextValue | undefined>(undefined);

/**
 * Provides the entries collection to the whole app.
 *
 * Why Context + useReducer (not Redux): the app has a single primary entity and
 * modest state, so the built-in tools give predictable, testable transitions
 * (the reducer is pure) with zero extra dependencies. See README "Architecture".
 */
export function EntriesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(entriesReducer, initialEntriesState);

  const reload = useCallback(async () => {
    dispatch({ type: 'LOADING' });
    try {
      const entries = await loadEntries();
      dispatch({ type: 'LOADED', payload: entries });
    } catch {
      dispatch({ type: 'ERROR', payload: 'Could not load your entries.' });
    }
  }, []);

  // Load the cached entries once on mount.
  useEffect(() => {
    reload();
  }, [reload]);

  // Persist whenever the collection changes (but not while still loading).
  useEffect(() => {
    if (!state.loading && !state.error) {
      saveEntries(state.entries).catch(() => {
        // Persistence failure is non-fatal for the current session.
      });
    }
  }, [state.entries, state.loading, state.error]);

  const addEntry = useCallback(async (draft: EntryDraft): Promise<Entry> => {
    const entry: Entry = {
      id: generateId(),
      title: draft.title.trim(),
      note: draft.note.trim(),
      photoUri: draft.photoUri,
      location: draft.location,
      createdAt: Date.now(),
    };
    dispatch({ type: 'ADD', payload: entry });
    return entry;
  }, []);

  const updateEntry = useCallback(async (entry: Entry) => {
    dispatch({ type: 'UPDATE', payload: entry });
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    dispatch({ type: 'DELETE', payload: id });
  }, []);

  const getEntry = useCallback(
    (id: string) => state.entries.find((entry) => entry.id === id),
    [state.entries],
  );

  const value = useMemo<EntriesContextValue>(
    () => ({ ...state, addEntry, updateEntry, deleteEntry, getEntry, reload }),
    [state, addEntry, updateEntry, deleteEntry, getEntry, reload],
  );

  return <EntriesContext.Provider value={value}>{children}</EntriesContext.Provider>;
}
