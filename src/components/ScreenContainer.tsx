import React, { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@/constants/theme';

/**
 * Wraps a screen with safe-area padding and consistent horizontal spacing.
 * Uses flex + insets (no hardcoded screen widths) so it adapts to any device
 * size and notch .
 */
export function ScreenContainer({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },
});
