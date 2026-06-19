import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useEntries } from '@/hooks/useEntries';
import { haptics } from '@/services/haptics';
import { formatDateTime } from '@/utils/formatDate';
import { colors, fontSize, radius, spacing } from '@/constants/theme';

export default function EntryDetailScreen() {
  // Route parameter passed via router.push(`/entry/${id}`).
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getEntry, deleteEntry } = useEntries();

  const entry = getEntry(id);
  const { width } = useWindowDimensions();

  if (!entry) {
    return (
      <ScreenContainer>
        <EmptyState title="Entry not found" subtitle="It may have been deleted." />
      </ScreenContainer>
    );
  }

  const confirmDelete = () => {
    Alert.alert('Delete entry', 'This cannot be undone. Delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          haptics.warning();
          await deleteEntry(entry.id);
          router.back();
        },
      },
    ]);
  };

  const photoSize = width - spacing.md * 2;

  return (
    <>
      <Stack.Screen options={{ title: entry.title }} />
      <ScreenContainer>
        <ScrollView showsVerticalScrollIndicator={false}>
          {entry.photoUri ? (
            <Image
              source={{ uri: entry.photoUri }}
              style={[styles.photo, { width: photoSize, height: photoSize }]}
            />
          ) : null}

          <Text style={styles.title}>{entry.title}</Text>
          <Text style={styles.date}>{formatDateTime(entry.createdAt)}</Text>

          {entry.location ? (
            <View style={styles.locationBox}>
              <Text style={styles.locationText}>
                📍 {entry.location.address ?? 'Saved location'}
              </Text>
              <Text style={styles.coords}>
                {entry.location.latitude.toFixed(5)}, {entry.location.longitude.toFixed(5)}
              </Text>
            </View>
          ) : null}

          {entry.note ? <Text style={styles.note}>{entry.note}</Text> : null}

          <View style={styles.deleteRow}>
            <Button title="Delete entry" variant="danger" onPress={confirmDelete} />
          </View>
        </ScrollView>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  photo: { borderRadius: radius.md, marginBottom: spacing.md, alignSelf: 'center' },
  title: { fontSize: fontSize.title, fontWeight: '700', color: colors.text },
  date: { fontSize: fontSize.caption, color: colors.textMuted, marginTop: spacing.xs },
  locationBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  locationText: { fontSize: fontSize.body, color: colors.text },
  coords: { fontSize: fontSize.caption, color: colors.textMuted, marginTop: spacing.xs },
  note: { fontSize: fontSize.body, color: colors.text, lineHeight: 24, marginTop: spacing.md },
  deleteRow: { marginTop: spacing.xl, marginBottom: spacing.xl },
});
