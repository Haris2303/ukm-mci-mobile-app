/**
 * Main theme export — iOS design language.
 * Import dari sini saja: import { colors, radius, shadow, spacing } from '../theme/theme';
 */

export { colors } from './colors';
export { fontFamily, fontSize, letterSpacing, lineHeight, typography } from './typography';

// ─── Spacing scale (4-point grid) ────────────────────────────────────────────
export const spacing = {
  0:  0,
  1:  4,
  2:  8,
  3:  12,
  4:  16,
  5:  20,
  6:  24,
  7:  28,
  8:  32,
  10: 40,
  12: 48,
  16: 64,
};

// ─── Border radius — iOS squircle range 10-14 ─────────────────────────────────
// Semua View yang pakai radius ini sebaiknya juga set experimental_continuousCorners={true}
export const radius = {
  xs:   6,
  sm:   10,   // small element (badge, chip)
  md:   12,   // default card / cell
  lg:   14,   // large card
  xl:   20,   // sheet / modal
  full: 999,  // pill
};

// ─── Shadow — iOS minimalist ──────────────────────────────────────────────────
// iOS menggunakan shadow sangat halus; elevation Android disesuaikan proporsional.
export const shadow = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.11,
    shadowRadius: 16,
    elevation: 5,
  },
};

// ─── Component size presets ───────────────────────────────────────────────────
export const size = {
  buttonHeightSm: 36,
  buttonHeightMd: 44,
  buttonHeightLg: 50,
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,
  listRowHeight: 44,       // iOS standard row height
  listIconSize:  30,       // icon squircle inside list row
};
