import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LockScreen } from '@/components/LockScreen';
import { Loading } from '@/components/Loading';
import { EntriesProvider } from '@/context/EntriesContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { useSettings } from '@/hooks/useSettings';
import { colors } from '@/constants/theme';

/**
 * Decides what to render based on the lock state:
 * - still reading SecureStore -> spinner
 * - lock enabled and not yet unlocked -> LockScreen (no way to bypass)
 * - otherwise -> the actual app navigation
 */
function AppGate() {
  const { ready, lockEnabled, unlocked } = useSettings();

  if (!ready) return <Loading message="Starting…" />;
  if (lockEnabled && !unlocked) return <LockScreen />;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="new"
        options={{ presentation: 'modal', title: 'New entry' }}
      />
      <Stack.Screen name="entry/[id]" options={{ title: 'Entry' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <SettingsProvider>
          <EntriesProvider>
            <StatusBar style="light" />
            <AppGate />
          </EntriesProvider>
        </SettingsProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
