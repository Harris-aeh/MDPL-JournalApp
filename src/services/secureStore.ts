import * as SecureStore from 'expo-secure-store';

import { SECURE_KEYS } from '@/constants/config';

/**
 * The optional app-lock PIN is sensitive, so it lives in SecureStore
 * (Keychain on iOS / Keystore on Android), never in AsyncStorage .
 */
export async function isLockEnabled(): Promise<boolean> {
  const value = await SecureStore.getItemAsync(SECURE_KEYS.LOCK_ENABLED);
  return value === 'true';
}

export async function enableLock(pin: string): Promise<void> {
  await SecureStore.setItemAsync(SECURE_KEYS.PIN, pin);
  await SecureStore.setItemAsync(SECURE_KEYS.LOCK_ENABLED, 'true');
}

export async function disableLock(): Promise<void> {
  await SecureStore.deleteItemAsync(SECURE_KEYS.PIN);
  await SecureStore.setItemAsync(SECURE_KEYS.LOCK_ENABLED, 'false');
}

export async function verifyPin(pin: string): Promise<boolean> {
  const stored = await SecureStore.getItemAsync(SECURE_KEYS.PIN);
  return stored !== null && stored === pin;
}
