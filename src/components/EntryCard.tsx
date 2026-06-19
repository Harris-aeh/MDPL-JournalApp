import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, radius, spacing } from '@/constants/theme';
import { formatDate } from '@/utils/formatDate';
import type { Entry } from '@/types';

interface EntryCardProps {
  entry: Entry;
  onPress: (id: string) => void;
}

function EntryCardComponent({ entry, onPress }: EntryCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(entry.id)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {entry.photoUri ? (
        <Image source={{ uri: entry.photoUri }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, styles.thumbPlaceholder]}>
          <Text style={styles.thumbEmoji}>📝</Text>
        </View>
      )}
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {entry.title}
        </Text>
        {entry.note ? (
          <Text style={styles.note} numberOfLines={2}>
            {entry.note}
          </Text>
        ) : null}
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{formatDate(entry.createdAt)}</Text>
          {entry.location?.address ? (
            <Text style={styles.meta} numberOfLines={1}>
              {'  ·  📍 '}
              {entry.location.address}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

/**
 * Memoized so that scrolling a long FlatList does not re-render every row
 * when an unrelated piece of state changes .
 */
export const EntryCard = React.memo(EntryCardComponent);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.85 },
  thumb: { width: 64, height: 64, borderRadius: radius.sm, marginRight: spacing.md },
  thumbPlaceholder: {
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbEmoji: { fontSize: 26 },
  body: { flex: 1, justifyContent: 'center' },
  title: { fontSize: fontSize.subtitle, fontWeight: '600', color: colors.text },
  note: { fontSize: fontSize.body, color: colors.textMuted, marginTop: 2 },
  metaRow: { flexDirection: 'row', marginTop: spacing.xs },
  meta: { fontSize: fontSize.caption, color: colors.textMuted },
});
