/**
 * Design tokens — iOS-style color palette.
 *
 * CHANGELOG:
 *   - colors.primary overwritten: #007AFF (iOS) → #1a4ff5 (brand UKM MCI)
 *   - Added: brand, brandLight, appBackground
 *   - Added semantic groups: warning*, info*, success (extended), error (extended)
 *   - Slate/grey migration deferred → lihat CHANGELOG_REFACTOR.md
 */

export const colors = {
  // ─── Brand ──────────────────────────────────────────────────────
  primary:    '#1a4ff5',        // Brand blue UKM MCI (sebelumnya #007AFF iOS default)
  primaryTint: '#E5F1FF',
  brand:      '#1a4ff5',        // Alias eksplisit — gunakan ini di komponen baru
  brandLight:  '#3671ff',       // Lighter variant untuk hover/gradient

  // ─── iOS System colors (referensi — jangan dipakai langsung di UI baru) ───
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
  backgroundSecondary:  '#FFFFFF',
  backgroundTertiary:   '#F2F2F7',
  appBackground:        '#f0f4ff',   // Blue-tinted page background (seluruh app)

  // ─── Surface (card / grouped list) ───────────────────────────────
  surface:          '#FFFFFF',
  surfaceSecondary: '#F2F2F7',
  surfaceElevated:  '#FFFFFF',

  // ─── Label ───────────────────────────────────────────────────────
  label:           '#000000',
  labelSecondary:  '#8E8E93',
  labelTertiary:   'rgba(60,60,67,0.3)',
  labelQuaternary: 'rgba(60,60,67,0.18)',
  labelOnPrimary:  '#FFFFFF',

  // ─── Fill ────────────────────────────────────────────────────────
  fill:          'rgba(120,120,128,0.2)',
  fillSecondary: 'rgba(120,120,128,0.16)',
  fillTertiary:  'rgba(120,120,128,0.12)',

  // ─── Separator ───────────────────────────────────────────────────
  separator:       'rgba(60,60,67,0.29)',
  separatorOpaque: '#C6C6C8',

  // ─── Border ──────────────────────────────────────────────────────
  border: 'rgba(0,0,0,0.08)',

  // ─── Semantic: Success ────────────────────────────────────────────
  success:       '#34C759',   // iOS system green — tetap untuk komponen iOS-style
  successLight:  '#F0FFF4',   // Legacy — backward compat
  successBg:     '#f0fdf4',   // Card/container background
  successBorder: '#86efac',   // Border/outline
  successIconBg: '#22c55e',   // Icon box / dot background
  successText:   '#15803d',   // Primary text on success surface
  successMuted:  '#16a34a',   // Secondary/muted text

  // ─── Semantic: Warning (tunggakan, cooldown, belum bayar) ─────────
  warning:       '#FF9500',   // iOS system orange — tetap
  warningLight:  '#FFF8E6',   // Legacy — backward compat
  warningBg:     '#fef3c7',   // Card/container background
  warningBorder: '#fcd34d',   // Border/outline
  warningIcon:   '#fbbf24',   // Icon box background
  warningText:   '#92400e',   // Primary text / title
  warningMuted:  '#a16207',   // Secondary/muted text

  // ─── Semantic: Info (instruksi, bantuan, callout) ─────────────────
  infoBg:     '#eff6ff',      // Container background
  infoBorder: '#bfdbfe',      // Border/outline
  infoText:   '#1e40af',      // Text dan icon

  // ─── Semantic: Error ─────────────────────────────────────────────
  error:        '#FF3B30',    // iOS system red — tetap
  errorLight:   '#FFF2F1',    // Legacy — backward compat
  errorAccent:  '#ef4444',    // Badge, dot, icon accent (red-500)
  errorStrong:  '#dc2626',    // Destructive text, nominal negatif (red-600)
  errorBg:      '#fee2e2',    // Light chip/badge background

  // ─── Neutral scale (iOS) ─────────────────────────────────────────
  neutral50:  '#F9FAFB',
  neutral100: '#F2F2F7',
  neutral200: '#E5E5EA',
  neutral300: '#D1D1D6',
  neutral400: '#AEAEB2',
  neutral500: '#8E8E93',
  neutral600: '#636366',
  neutral700: '#48484A',
  neutral800: '#3A3A3C',
  neutral900: '#1C1C1E',

  // ─── Legacy (backward compat dengan komponen lama) ───────────────
  textPrimary:   '#000000',
  textSecondary: '#8E8E93',
  textMuted:     'rgba(60,60,67,0.3)',
  textOnPrimary: '#FFFFFF',
  badgeBg:       '#E5F1FF',
  badgeText:     '#007AFF',   // Intentional: iOS blue untuk badge system
};
