/**
 * Design tokens — iOS-style color palette.
 */

export const colors = {
  // ─── Brand ──────────────────────────────────────────────────────
  primary: '#007AFF',        // iOS system blue
  primaryTint: '#E5F1FF',    // 10% opacity blue fill

  // ─── iOS System colors ───────────────────────────────────────────
  systemBlue:   '#007AFF',
  systemGreen:  '#34C759',
  systemRed:    '#FF3B30',
  systemOrange: '#FF9500',
  systemPurple: '#AF52DE',
  systemTeal:   '#5AC8FA',
  systemYellow: '#FFCC00',
  systemIndigo: '#5856D6',
  systemPink:   '#FF2D55',
  systemMint:   '#00C7BE',

  // ─── Background ──────────────────────────────────────────────────
  background:           '#F2F2F7',   // systemGroupedBackground
  backgroundSecondary:  '#FFFFFF',   // systemBackground
  backgroundTertiary:   '#F2F2F7',   // systemTertiaryBackground

  // ─── Surface (card / grouped list) ───────────────────────────────
  surface:          '#FFFFFF',
  surfaceSecondary: '#F2F2F7',
  surfaceElevated:  '#FFFFFF',

  // ─── Label ───────────────────────────────────────────────────────
  label:          '#000000',
  labelSecondary: '#8E8E93',
  labelTertiary:  'rgba(60,60,67,0.3)',
  labelQuaternary:'rgba(60,60,67,0.18)',
  labelOnPrimary: '#FFFFFF',

  // ─── Fill (tappable overlay, etc.) ───────────────────────────────
  fill:          'rgba(120,120,128,0.2)',
  fillSecondary: 'rgba(120,120,128,0.16)',
  fillTertiary:  'rgba(120,120,128,0.12)',

  // ─── Separator ───────────────────────────────────────────────────
  separator:       'rgba(60,60,67,0.29)',
  separatorOpaque: '#C6C6C8',

  // ─── Border ──────────────────────────────────────────────────────
  border: 'rgba(0,0,0,0.08)',

  // ─── Legacy (backward compat dengan komponen lama) ───────────────
  textPrimary:   '#000000',
  textSecondary: '#8E8E93',
  textMuted:     'rgba(60,60,67,0.3)',
  textOnPrimary: '#FFFFFF',
  badgeBg:       '#E5F1FF',
  badgeText:     '#007AFF',
  success:       '#34C759',
  successLight:  '#F0FFF4',
  warning:       '#FF9500',
  warningLight:  '#FFF8E6',
  error:         '#FF3B30',
  errorLight:    '#FFF2F1',
  neutral50:     '#F9FAFB',
  neutral100:    '#F2F2F7',
  neutral200:    '#E5E5EA',
  neutral300:    '#D1D1D6',
  neutral400:    '#AEAEB2',
  neutral500:    '#8E8E93',
  neutral600:    '#636366',
  neutral700:    '#48484A',
  neutral800:    '#3A3A3C',
  neutral900:    '#1C1C1E',
};
