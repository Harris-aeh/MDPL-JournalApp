import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { EntryCard } from '@/components/EntryCard';
import { Loading } from '@/components/Loading';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useEntries } from '@/hooks/useEntries';
import { haptics } from '@/services/haptics';
import { colors, fontSize, radius, spacing } from '@/constants/theme';
import type { Entry } from '@/types';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default function EntriesScreen() {
  const router = useRouter();
  const { entries, loading, error, reload } = useEntries();

// Snapshot the current time once at mount via a lazy initializer, so the
  // render stays pure — no impure Date.now() call during render ).
  const [now] = useState(() => Date.now());

  // Derived stats are memoized so they only recompute when entries change.
  const stats = useMemo(() => {
    const thisWeek = entries.filter((e) => now - e.createdAt < WEEK_MS).length;
    return { total: entries.length, thisWeek };
  }, [entries, now]);

  // Stable callbacks so the memoized EntryCard rows do not re-render needlessly.
  const openEntry = useCallback(
    (id: string) => {
      haptics.light();
      router.push(`/entry/${id}`);
    },
    [router],
  );

  const goToNew = useCallback(() => {
    haptics.light();
    router.push('/new');
  }, [router]);

  const renderItem = useCallback(
    ({ item }: { item: Entry }) => <EntryCard entry={item} onPress={openEntry} />,
    [openEntry],
  );

  if (loading) {
    return (
      <ScreenContainer>
        <Loading message="Loading your entries…" />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Retry" onPress={reload} variant="secondary" />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.thisWeek}</Text>
          <Text style={styles.statLabel}>This week</Text>
        </View>
      </View>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        initialNumToRender={10}
        removeClippedSubviews
        contentContainerStyle={entries.length === 0 ? styles.emptyContent : styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="No entries yet"
            subtitle="Tap the + button to record your first field note."
          />
        }
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add entry"
        onPress={goToNew}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <Ionicons name="add" size={32} color={colors.white} />
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: { fontSize: fontSize.heading, fontWeight: '700', color: colors.primary },
  statLabel: { fontSize: fontSize.caption, color: colors.textMuted },
  listContent: { paddingBottom: 96 },
  emptyContent: { flexGrow: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  errorText: { color: colors.danger, fontSize: fontSize.body, textAlign: 'center' },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  fabPressed: { opacity: 0.85 },
});
