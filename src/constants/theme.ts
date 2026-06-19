/**
 * Single source of truth for colors, spacing, typography and radii.
 * Every component imports from here so the UI stays consistent across screens.
 */

export const colors = {
  primary: '#0F3D3E',
  primaryLight: '#19595B',
  accent: '#E8A87C',
  background: '#F6F8F8',
  surface: '#FFFFFF',
  text: '#1A2421',
  textMuted: '#5C6B68',
  border: '#DCE4E3',
  danger: '#C0392B',
  success: '#1E8449',
  white: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
} as const;

export const fontSize = {
  caption: 12,
  body: 16,
  subtitle: 18,
  title: 24,
  heading: 30,
} as const;
