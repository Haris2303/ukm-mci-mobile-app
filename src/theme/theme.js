/**
 * Main theme export.
 * Import dari sini saja di seluruh codebase:
 *   import { colors, typography, spacing, radius, shadow } from '../theme/theme';
 */

export { colors } from './colors';
export { fontFamily, fontSize, letterSpacing, lineHeight, typography } from './typography';

// ─── Spacing scale (4-point grid) ────────────────────────────────────────────
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
};

// ─── Border radius ────────────────────────────────────────────────────────────
export const radius = {
  sm: 6,
  md: 10,
  lg: 12,   // card
  xl: 16,
  '2xl': 20,
  full: 999, // pill / button
};

// ─── Shadow (cross-platform) ──────────────────────────────────────────────────
// Gunakan spread: { ...shadow.sm }
export const shadow = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#0d253d',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#0d253d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0d253d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
  },
};

// ─── Ukuran komponen standar ───────────────────────────────────────────────────
export const size = {
  buttonHeightSm: 36,
  buttonHeightMd: 44,
  buttonHeightLg: 52,
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,
};
