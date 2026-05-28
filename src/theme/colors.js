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
  primary: '#1a4ff5', // Brand blue UKM MCI (sebelumnya #007AFF iOS default)
  primaryTint: '#E5F1FF',
  brand: '#1a4ff5', // Alias eksplisit — gunakan ini di komponen baru
  brandLight: '#3671ff', // Lighter variant untuk hover/gradient

  // ─── iOS System colors (referensi — jangan dipakai langsung di UI baru) ───
  systemBlue: '#007AFF',
  systemGreen: '#34C759',
  systemRed: '#FF3B30',
  systemOrange: '#FF9500',
  systemPurple: '#AF52DE',
  systemTeal: '#5AC8FA',
  systemYellow: '#FFCC00',
  systemIndigo: '#5856D6',
  systemPink: '#FF2D55',
  systemMint: '#00C7BE',

  // ─── Background ──────────────────────────────────────────────────
  background: '#F2F2F7', // systemGroupedBackground
  backgroundSecondary: '#FFFFFF',
  backgroundTertiary: '#F2F2F7',
  backgroundDark: '#000',
  appBackground: '#f0f4ff', // Blue-tinted page background (seluruh app)

  // ─── Surface (card / grouped list) ───────────────────────────────
  surface: '#FFFFFF',
  surfaceSecondary: '#F2F2F7',
  surfaceElevated: '#FFFFFF',

  // ─── Label ───────────────────────────────────────────────────────
  label: '#000000',
  labelSecondary: '#8E8E93',
  labelTertiary: 'rgba(60,60,67,0.3)',
  labelQuaternary: 'rgba(60,60,67,0.18)',
  labelOnPrimary: '#FFFFFF',

  // ─── Fill ────────────────────────────────────────────────────────
  fill: 'rgba(120,120,128,0.2)',
  fillSecondary: 'rgba(120,120,128,0.16)',
  fillTertiary: 'rgba(120,120,128,0.12)',

  // ─── Separator ───────────────────────────────────────────────────
  separator: 'rgba(60,60,67,0.29)',
  separatorOpaque: '#C6C6C8',

  // ─── Border ──────────────────────────────────────────────────────
  border: 'rgba(0,0,0,0.08)',
  borderTransparent: 'transparent',

  // ─── Shadow ──────────────────────────────────────────────────────
  shadow: '#000',

  // ─── Semantic: Success ────────────────────────────────────────────
  success: '#34C759', // iOS system green — tetap untuk komponen iOS-style
  successLight: '#F0FFF4', // Legacy — backward compat
  successBg: '#f0fdf4', // Card/container background
  successBorder: '#86efac', // Border/outline
  successIconBg: '#22c55e', // Icon box / dot background
  successText: '#15803d', // Primary text on success surface
  successMuted: '#16a34a', // Secondary/muted text

  // ─── Semantic: Warning (tunggakan, cooldown, belum bayar) ─────────
  warning: '#FF9500', // iOS system orange — tetap
  warningLight: '#FFF8E6', // Legacy — backward compat
  warningBg: '#fef3c7', // Card/container background
  warningBorder: '#fcd34d', // Border/outline
  warningIcon: '#fbbf24', // Icon box background
  warningText: '#92400e', // Primary text / title
  warningMuted: '#a16207', // Secondary/muted text

  // ─── Semantic: Info (instruksi, bantuan, callout) ─────────────────
  infoBg: '#eff6ff', // Container background
  infoBorder: '#bfdbfe', // Border/outline
  infoText: '#1e40af', // Text dan icon

  // ─── Semantic: Error ─────────────────────────────────────────────
  error: '#FF3B30', // iOS system red — tetap
  errorLight: '#FFF2F1', // Legacy — backward compat
  errorAccent: '#ef4444', // Badge, dot, icon accent (red-500)
  errorStrong: '#dc2626', // Destructive text, nominal negatif (red-600)
  errorBg: '#fee2e2', // Light chip/badge background
  errorBorder: '#fca5a5',

  // ─── Neutral scale (iOS) ─────────────────────────────────────────
  neutral50: '#F9FAFB',
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
  textPrimary: '#000000',
  textSecondary: '#8E8E93',
  textMuted: 'rgba(60,60,67,0.3)',
  textOnPrimary: '#FFFFFF',
  badgeBg: '#E5F1FF',
  badgeText: '#007AFF', // Intentional: iOS blue untuk badge system

  // ─── Slate palette (Tailwind CSS v3) ─────────────────────────────
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1e293b',
  slate900: '#0f172a',

  // ─── Extended blue palette ────────────────────────────────────────
  blue100: '#dbeafe',
  blue200: '#bdd8ff',
  blue300: '#93c5fd',
  blue500: '#3b82f6',
  blue600: '#1a56db',
  blue700: '#1d4ed8',
  blueLight: '#eef5ff',

  // ─── Sky palette (Tailwind CSS v3) ────────────────────────────────
  sky300: '#38bdf8',
  sky500: '#0ea5e9',

  // ─── Violet / purple palette ──────────────────────────────────────
  violet50: '#f5f3ff',
  violet600: '#7c3aed',
  violet700: '#6d28d9',

  // ─── Amber / orange extended ──────────────────────────────────────
  amber50: '#fffbeb',
  amber200: '#fde68a',
  amber400: '#fbbf24', // Alias: warningIcon
  amber500: '#f59e0b',
  amber600: '#d97706',
  orange900: '#7c2d12',

  // ─── Additional green ─────────────────────────────────────────────
  green100: '#dcfce7',
  green400: '#4ade80',

  // ─── Tailwind Emerald ─────────────────────────────────────────────
  emerald500: '#10b981', // materi "umum" accent
  emerald600: '#059669', // home E-Kas menu icon

  // ─── Tailwind Cyan ────────────────────────────────────────────────
  cyan600: '#0891b2', // home ID Card menu icon

  // ─── Tailwind Pink ────────────────────────────────────────────────
  pink700: '#be185d', // home Profil menu icon

  // ─── Additional red/error ─────────────────────────────────────────
  red50: '#fff5f5',
  red50b: '#fef2f2',
  red200: '#fecaca', // light-red border (e.g. logout button)

  // ─── Additional neutral ───────────────────────────────────────────
  gray700: '#374151',
  yellow100: '#fef9c3',

  // ─── White alpha overlays ─────────────────────────────────────────
  whiteAlpha8: 'rgba(255,255,255,0.08)',
  whiteAlpha10: 'rgba(255,255,255,0.1)',
  whiteAlpha12: 'rgba(255,255,255,0.12)',
  whiteAlpha15: 'rgba(255,255,255,0.15)',
  whiteAlpha18: 'rgba(255,255,255,0.18)',
  whiteAlpha20: 'rgba(255,255,255,0.2)',
  whiteAlpha25: 'rgba(255,255,255,0.25)',
  whiteAlpha50: 'rgba(255,255,255,0.5)',
  whiteAlpha55: 'rgba(255,255,255,0.55)',
  whiteAlpha60: 'rgba(255,255,255,0.6)',
  whiteAlpha70: 'rgba(255,255,255,0.7)',
  whiteAlpha75: 'rgba(255,255,255,0.75)',
  whiteAlpha80: 'rgba(255,255,255,0.8)',
  whiteAlpha85: 'rgba(255,255,255,0.85)',
  whiteAlpha92: 'rgba(255,255,255,0.92)',

  // ─── Black alpha overlays ─────────────────────────────────────────
  blackAlpha5: 'rgba(0,0,0,0.05)',
  blackAlpha45: 'rgba(0,0,0,0.45)',
  blackAlpha55: 'rgba(0,0,0,0.55)',
  blackAlpha75: 'rgba(0,0,0,0.75)',

  // ─── Disabled / alpha state ───────────────────────────────────────
  whiteAlpha35: 'rgba(255,255,255,0.35)', // disabled icon on dark bg (Android header)
  slate800Alpha30: 'rgba(30,41,59,0.3)', // disabled icon on light bg (iOS header)

  // ─── Special overlays (chart / feature-specific) ──────────────────
  tealAlpha10: 'rgba(15,244,198,0.1)',
  redAlpha10: 'rgba(255,59,48,0.1)',
  redAlpha25: 'rgba(239,68,68,0.25)',
  amberAlpha15: 'rgba(217,119,6,0.15)',
};
