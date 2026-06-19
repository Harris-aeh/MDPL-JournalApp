import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from './Button';
import { TextField } from './TextField';
import { useSettings } from '@/hooks/useSettings';
import { verifyPin } from '@/services/secureStore';
import { haptics } from '@/services/haptics';
import { colors, fontSize, spacing } from '@/constants/theme';
import { LIMITS } from '@/constants/config';

/**
 * Gate shown on launch when the user has enabled the PIN lock. The PIN itself
 * is checked against the value held in SecureStore ).
 */
export function LockScreen() {
  const { unlock } = useSettings();
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const onSubmit = async () => {
    setChecking(true);
    setError(null);
    try {
      const ok = await verifyPin(pin);
      if (ok) {
        haptics.success();
        unlock();
      } else {
        haptics.warning();
        setError('Incorrect PIN. Try again.');
        setPin('');
      }
    } catch {
      setError('Could not verify your PIN.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🔒</Text>
      <Text style={styles.title}>FieldNotes is locked</Text>
      <Text style={styles.subtitle}>Enter your {LIMITS.PIN_LENGTH}-digit PIN to continue</Text>
      <View style={styles.field}>
        <TextField
          label="PIN"
          value={pin}
          onChangeText={setPin}
          keyboardType="number-pad"
          secureTextEntry
          maxLength={LIMITS.PIN_LENGTH}
          error={error ?? undefined}
          placeholder="••••"
        />
        <Button title="Unlock" onPress={onSubmit} loading={checking} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  emoji: { fontSize: 48, marginBottom: spacing.md },
  title: { fontSize: fontSize.title, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: fontSize.body, color: colors.textMuted, marginTop: spacing.xs },
  field: { alignSelf: 'stretch', marginTop: spacing.xl },
});
