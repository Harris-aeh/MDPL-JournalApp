import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { OfflineBanner } from '@/components/OfflineBanner';
import { colors } from '@/constants/theme';

/**
 * Bottom tabs. Combined with the root Stack and the modal, the app uses three
 * navigation patterns (tabs + stack + modal), exceeding the two required
 *  The offline banner sits above the tabs on every screen.
 */
export default function TabsLayout() {
  return (
    <>
      <OfflineBanner />
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Entries',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="journal-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
