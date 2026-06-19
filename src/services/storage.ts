import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/config';
import type { Entry } from '@/types';

/**
 * Local persistence for entries using AsyncStorage.
 * This doubles as the offline cache: data written here is available with no
 * network connection and survives app restarts.
 */
export async function loadEntries(): Promise<Entry[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.ENTRIES);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Entry[]) : [];
  } catch {
    // Corrupted cache should not crash the app; start fresh instead.
    return [];
  }
}

export async function saveEntries(entries: Entry[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
}
