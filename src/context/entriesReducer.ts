import type { Entry } from '@/types';

export interface EntriesState {
  entries: Entry[];
  loading: boolean;
  error: string | null;
}

export type EntriesAction =
  | { type: 'LOADING' }
  | { type: 'LOADED'; payload: Entry[] }
  | { type: 'ERROR'; payload: string }
  | { type: 'ADD'; payload: Entry }
  | { type: 'UPDATE'; payload: Entry }
  | { type: 'DELETE'; payload: string };

export const initialEntriesState: EntriesState = {
  entries: [],
  loading: true,
  error: null,
};

/**
 * Pure reducer for the entries collection. Contains no side effects, which makes
 * the whole state-transition logic trivial to unit test.
 */
export function entriesReducer(state: EntriesState, action: EntriesAction): EntriesState {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true, error: null };

    case 'LOADED':
      return { entries: action.payload, loading: false, error: null };

    case 'ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'ADD':
      // Newest first.
      return { ...state, entries: [action.payload, ...state.entries] };

    case 'UPDATE':
      return {
        ...state,
        entries: state.entries.map((entry) =>
          entry.id === action.payload.id ? action.payload : entry,
        ),
      };

    case 'DELETE':
      return {
        ...state,
        entries: state.entries.filter((entry) => entry.id !== action.payload),
      };

    default:
      return state;
  }
}
