import React, { Component, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from './Button';
import { colors, fontSize, spacing } from '@/constants/theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Class component (required for error boundaries) that catches rendering errors
 * and shows a recoverable fallback instead of a white screen .
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // In a real app this is where you would log to a monitoring service.
    console.error('Caught by ErrorBoundary:', error);
  }

  reset = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>😵</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.subtitle}>
            The app hit an unexpected error. You can try again.
          </Text>
          <View style={styles.button}>
            <Button title="Try again" onPress={this.reset} />
          </View>
        </View>
      );
    }

    return this.props.children;
  }
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
  subtitle: {
    fontSize: fontSize.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  button: { marginTop: spacing.lg, alignSelf: 'stretch' },
});
