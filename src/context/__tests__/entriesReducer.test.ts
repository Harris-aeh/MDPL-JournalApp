import {
  entriesReducer,
  initialEntriesState,
  type EntriesState,
} from '@/context/entriesReducer';
import type { Entry } from '@/types';

const makeEntry = (id: string): Entry => ({
  id,
  title: `Entry ${id}`,
  note: '',
  createdAt: 1,
});

describe('entriesReducer', () => {
  it('LOADED replaces entries and clears loading', () => {
    const next = entriesReducer(initialEntriesState, {
      type: 'LOADED',
      payload: [makeEntry('1')],
    });
    expect(next.loading).toBe(false);
    expect(next.entries).toHaveLength(1);
  });

  it('ADD prepends the new entry (newest first)', () => {
    const start: EntriesState = { entries: [makeEntry('1')], loading: false, error: null };
    const next = entriesReducer(start, { type: 'ADD', payload: makeEntry('2') });
    expect(next.entries.map((e) => e.id)).toEqual(['2', '1']);
  });

  it('UPDATE replaces the matching entry only', () => {
    const start: EntriesState = {
      entries: [makeEntry('1'), makeEntry('2')],
      loading: false,
      error: null,
    };
    const updated = { ...makeEntry('1'), title: 'Changed' };
    const next = entriesReducer(start, { type: 'UPDATE', payload: updated });
    expect(next.entries.find((e) => e.id === '1')?.title).toBe('Changed');
    expect(next.entries.find((e) => e.id === '2')?.title).toBe('Entry 2');
  });

  it('DELETE removes the entry with the given id', () => {
    const start: EntriesState = {
      entries: [makeEntry('1'), makeEntry('2')],
      loading: false,
      error: null,
    };
    const next = entriesReducer(start, { type: 'DELETE', payload: '1' });
    expect(next.entries.map((e) => e.id)).toEqual(['2']);
  });

  it('ERROR stores the message and stops loading', () => {
    const next = entriesReducer(initialEntriesState, { type: 'ERROR', payload: 'boom' });
    expect(next.error).toBe('boom');
    expect(next.loading).toBe(false);
  });
});
