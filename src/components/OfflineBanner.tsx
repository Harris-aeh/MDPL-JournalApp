import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { useConnectivity } from '@/hooks/useConnectivity';
import { colors, fontSize, spacing } from '@/constants/theme';

/**
 * Shows a small banner when there is no connection. The app keeps working from
 * the local cache, so this is informational rather than blocking .
 */
export function OfflineBanner() {
  const isOnline = useConnectivity();
  if (isOnline) return null;

  return (
    <Text style={styles.banner}>You are offline — showing saved entries</Text>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.accent,
    color: colors.text,
    textAlign: 'center',
    paddingVertical: spacing.xs,
    fontSize: fontSize.caption,
    fontWeight: '600',
  },
});
