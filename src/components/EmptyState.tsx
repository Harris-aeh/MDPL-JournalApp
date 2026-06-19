import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, spacing } from '@/constants/theme';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
}

/** Friendly placeholder when a list has no items . */
export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📭</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emoji: { fontSize: 48, marginBottom: spacing.md },
  title: { fontSize: fontSize.subtitle, fontWeight: '600', color: colors.text },
  subtitle: {
    fontSize: fontSize.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
