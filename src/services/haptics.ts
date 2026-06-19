import * as Haptics from 'expo-haptics';

/**
 * Thin wrapper around expo-haptics. Haptics are a "nice to have", so failures
 * (e.g. on a device without a vibration motor) are swallowed silently.
 */
export const haptics = {
  light(): void {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  },
  success(): void {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  },
  warning(): void {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
  },
};
