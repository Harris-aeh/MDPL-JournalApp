import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { disableLock, enableLock, isLockEnabled } from '@/services/secureStore';

interface SettingsContextValue {
  /** Whether the user has turned on the PIN lock. */
  lockEnabled: boolean;
  /** Whether the user has unlocked the app during this session. */
  unlocked: boolean;
  ready: boolean;
  enableAppLock: (pin: string) => Promise<void>;
  disableAppLock: () => Promise<void>;
  unlock: () => void;
}

export const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [lockEnabled, setLockEnabled] = useState(false);
  const [unlocked, setUnlocked] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const enabled = await isLockEnabled();
        setLockEnabled(enabled);
        // If a lock exists, the app starts locked and must be unlocked.
        setUnlocked(!enabled);
      } catch {
        setLockEnabled(false);
        setUnlocked(true);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const enableAppLock = useCallback(async (pin: string) => {
    await enableLock(pin);
    setLockEnabled(true);
    setUnlocked(true);
  }, []);

  const disableAppLock = useCallback(async () => {
    await disableLock();
    setLockEnabled(false);
    setUnlocked(true);
  }, []);

  const unlock = useCallback(() => setUnlocked(true), []);

  const value = useMemo<SettingsContextValue>(
    () => ({ lockEnabled, unlocked, ready, enableAppLock, disableAppLock, unlock }),
    [lockEnabled, unlocked, ready, enableAppLock, disableAppLock, unlock],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
