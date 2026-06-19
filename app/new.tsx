import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { useEntries } from '@/hooks/useEntries';
import { getCurrentLocation, LocationPermissionError } from '@/services/location';
import { MediaPermissionError, pickFromGallery, takePhoto } from '@/services/media';
import { haptics } from '@/services/haptics';
import { validateEntry } from '@/utils/validation';
import { colors, fontSize, radius, spacing } from '@/constants/theme';
import { LIMITS } from '@/constants/config';
import type { EntryLocation } from '@/types';

export default function NewEntryScreen() {
  const router = useRouter();
  const { addEntry } = useEntries();
  const { width } = useWindowDimensions();

  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [location, setLocation] = useState<EntryLocation | undefined>();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);


  const previewSize = width * 0.55;

  const handlePhoto = async (source: 'camera' | 'gallery') => {
    try {
      const uri = source === 'camera' ? await takePhoto() : await pickFromGallery();
      if (uri) {
        haptics.light();
        setPhotoUri(uri);
      }
    } catch (err) {
      if (err instanceof MediaPermissionError) {
        Alert.alert('Permission needed', err.message);
      } else {
        Alert.alert('Could not get photo', 'Please try again.');
      }
    }
  };

  const handleLocation = async () => {
    setLocating(true);
    try {
      const loc = await getCurrentLocation();
      haptics.light();
      setLocation(loc);
    } catch (err) {
      if (err instanceof LocationPermissionError) {
        Alert.alert('Location permission needed', 'Enable location access to tag this entry.');
      } else {
        Alert.alert('Could not get location', 'Please try again in a moment.');
      }
    } finally {
      setLocating(false);
    }
  };

  const handleSave = async () => {
    const draft = { title, note, photoUri, location };
    const result = validateEntry(draft);
    if (!result.valid) {
      setErrors(result.errors);
      haptics.warning();
      return;
    }

    setSaving(true);
    try {
      await addEntry(draft);
      haptics.success();
      router.back();
    } catch {
      Alert.alert('Could not save', 'Something went wrong saving your entry.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TextField
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="A short title"
          maxLength={LIMITS.TITLE_MAX}
          error={errors.title}
        />

        <TextField
          label="Note"
          value={note}
          onChangeText={setNote}
          placeholder="What happened?"
          multiline
          numberOfLines={4}
          maxLength={LIMITS.NOTE_MAX}
          style={styles.multiline}
          error={errors.note}
        />

        <Text style={styles.sectionLabel}>Photo</Text>
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={[styles.preview, { width: previewSize, height: previewSize }]}
          />
        ) : null}
        <View style={styles.row}>
          <View style={styles.flex}>
            <Button title="Camera" variant="secondary" onPress={() => handlePhoto('camera')} />
          </View>
          <View style={styles.flex}>
            <Button title="Gallery" variant="secondary" onPress={() => handlePhoto('gallery')} />
          </View>
        </View>

        <Text style={styles.sectionLabel}>Location</Text>
        {location ? (
          <Text style={styles.locationText}>
            📍 {location.address ?? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
          </Text>
        ) : (
          <Text style={styles.locationMuted}>No location attached</Text>
        )}
        <Pressable
          accessibilityRole="button"
          onPress={handleLocation}
          disabled={locating}
          style={({ pressed }) => [styles.locationBtn, pressed && styles.pressed]}
        >
          {locating ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={styles.locationBtnText}>
              {location ? 'Update location' : 'Add current location'}
            </Text>
          )}
        </Pressable>

        <View style={styles.saveRow}>
          <Button title="Save entry" onPress={handleSave} loading={saving} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.md, backgroundColor: colors.background },
  multiline: { minHeight: 100, textAlignVertical: 'top' },
  sectionLabel: {
    fontSize: fontSize.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  preview: { borderRadius: radius.md, alignSelf: 'center', marginBottom: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
  locationText: { fontSize: fontSize.body, color: colors.text },
  locationMuted: { fontSize: fontSize.body, color: colors.textMuted },
  locationBtn: {
    marginTop: spacing.sm,
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationBtnText: { color: colors.primary, fontSize: fontSize.body, fontWeight: '600' },
  pressed: { opacity: 0.85 },
  saveRow: { marginTop: spacing.xl },
});
