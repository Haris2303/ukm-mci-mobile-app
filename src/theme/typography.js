/**
 * Typography tokens — Inter weight 300 & 400 saja, sesuai web.
 *
 * Pastikan font sudah di-load di App.js sebelum dipakai:
 *   import { Inter_300Light, Inter_400Regular } from '@expo-google-fonts/inter';
 *   const [fontsLoaded] = useFonts({ Inter_300Light, Inter_400Regular });
 */

// Nama family harus cocok persis dengan key yang di-pass ke useFonts()
export const fontFamily = {
  light: 'Inter_300Light',    // weight 300 — heading, body
  regular: 'Inter_400Regular', // weight 400 — label, button, caption
};

// Scale font (React Native menggunakan dp, bukan px/rem)
export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 30,
  '3xl': 36,
  '4xl': 44,
};

// Letter-spacing negatif untuk heading besar (sama dengan web)
export const letterSpacing = {
  tighter: -1.4,
  tight: -0.64,
  normal: 0,
  wide: 0.5,
  wider: 1.0,
};

// Line-height multiplier (RN memakai nilai absolut dalam dp)
export const lineHeight = {
  tight: 1.2,   // heading
  snug: 1.35,
  normal: 1.5,  // body
  relaxed: 1.65,
};

/**
 * Text style presets — gunakan spread: { ...typography.h1 }
 * fontFamily harus sudah loaded agar tidak jatuh ke sistem default.
 */
export const typography = {
  // Heading
  h1: {
    fontFamily: fontFamily.light,
    fontSize: fontSize['4xl'],
    letterSpacing: letterSpacing.tighter,
  },
  h2: {
    fontFamily: fontFamily.light,
    fontSize: fontSize['3xl'],
    letterSpacing: letterSpacing.tighter,
  },
  h3: {
    fontFamily: fontFamily.light,
    fontSize: fontSize['2xl'],
    letterSpacing: letterSpacing.tight,
  },
  h4: {
    fontFamily: fontFamily.light,
    fontSize: fontSize.xl,
    letterSpacing: letterSpacing.tight,
  },
  h5: {
    fontFamily: fontFamily.light,
    fontSize: fontSize.lg,
    letterSpacing: letterSpacing.tight,
  },

  // Body
  bodyLg: {
    fontFamily: fontFamily.light,
    fontSize: fontSize.md,
  },
  body: {
    fontFamily: fontFamily.light,
    fontSize: fontSize.base,
  },
  bodySm: {
    fontFamily: fontFamily.light,
    fontSize: fontSize.sm,
  },

  // Label / button / caption
  label: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
  },
  labelSm: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    letterSpacing: letterSpacing.wide,
  },

  // Badge/pill — uppercase + spaced
  badge: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase',
  },
};
