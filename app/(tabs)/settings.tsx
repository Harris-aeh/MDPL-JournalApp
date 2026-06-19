import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useEntries } from '@/hooks/useEntries';
import { useSettings } from '@/hooks/useSettings';
import { haptics } from '@/services/haptics';
import { isValidPin } from '@/utils/validation';
import { colors, fontSize, radius, spacing } from '@/constants/theme';
import { LIMITS } from '@/constants/config';

export default function SettingsScreen() {
  const { lockEnabled, enableAppLock, disableAppLock } = useSettings();
  const { entries, deleteEntry } = useEntries();

  const [settingPin, setSettingPin] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  const onToggleLock = (value: boolean) => {
    if (value) {
      setSettingPin(true);
    } else {
      disableAppLock();
      haptics.light();
    }
  };

  const confirmPin = async () => {
    if (!isValidPin(pin)) {
      setPinError(`PIN must be exactly ${LIMITS.PIN_LENGTH} digits.`);
      return;
    }
    await enableAppLock(pin);
    haptics.success();
    setSettingPin(false);
    setPin('');
    setPinError(null);
  };

  const clearAll = () => {
    if (entries.length === 0) return;
    Alert.alert('Clear all entries', `Delete all ${entries.length} entries? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete all',
        style: 'destructive',
        onPress: async () => {
          haptics.warning();
          // Delete sequentially through the same path used everywhere else.
          for (const entry of [...entries]) {
            await deleteEntry(entry.id);
          }
        },
      },
    ]);
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={styles.flex}>
              <Text style={styles.rowTitle}>App lock</Text>
              <Text style={styles.rowSubtitle}>
                Require a {LIMITS.PIN_LENGTH}-digit PIN to open the app.
              </Text>
            </View>
            <Switch
              value={lockEnabled}
              onValueChange={onToggleLock}
              trackColor={{ true: colors.primaryLight }}
            />
          </View>

          {settingPin ? (
            <View style={styles.pinBox}>
              <TextField
                label="Choose a PIN"
                value={pin}
                onChangeText={setPin}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={LIMITS.PIN_LENGTH}
                placeholder="••••"
                error={pinError ?? undefined}
              />
              <Button title="Set PIN" onPress={confirmPin} />
            </View>
          ) : null}
        </View>

        <Text style={styles.sectionTitle}>Data</Text>
        <View style={styles.card}>
          <Text style={styles.rowSubtitle}>
            All entries are stored on this device and available offline.
          </Text>
          <View style={styles.clearBtn}>
            <Button
              title="Clear all entries"
              variant="danger"
              onPress={clearAll}
              disabled={entries.length === 0}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <Text style={styles.rowTitle}>FieldNotes</Text>
          <Text style={styles.rowSubtitle}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  sectionTitle: {
    fontSize: fontSize.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  rowBetween: { flexDirection: 'row', alignItems: 'center' },
  rowTitle: { fontSize: fontSize.body, fontWeight: '600', color: colors.text },
  rowSubtitle: { fontSize: fontSize.caption, color: colors.textMuted, marginTop: 2 },
  pinBox: { marginTop: spacing.md },
  clearBtn: { marginTop: spacing.md },
});
