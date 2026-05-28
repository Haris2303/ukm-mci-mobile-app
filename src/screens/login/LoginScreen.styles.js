import { StyleSheet } from 'react-native';

import { colors } from '@theme/colors';

/** Warna gradient SVG judul "UKM MCI" — dekoratif, spesifik ke layar login */
export const TITLE_GRADIENT = {
  start: colors.brand, // #1a4ff5
  mid: colors.sky500, // #0ea5e9
  end: colors.sky300, // #38bdf8
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  // ── Header ──────────────────────────────────────────────────────
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBox: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.blue600,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    padding: 10,
  },
  logoImage: { width: 70, height: 70 },
  appTagline: {
    fontSize: 14,
    color: colors.slate500,
    marginTop: 4,
  },

  // ── Card ────────────────────────────────────────────────────────
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 28,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.slate800,
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.slate400,
    marginBottom: 28,
  },

  // ── Input ───────────────────────────────────────────────────────
  inputGroup: { marginBottom: 20 },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.slate600,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.slate800,
    backgroundColor: colors.slate50,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eyeBtn: {
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.slate50,
  },

  // ── Button ──────────────────────────────────────────────────────
  btnLogin: {
    backgroundColor: colors.blue600,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: colors.blue600,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: { opacity: 0.65 },
  btnLoginText: {
    color: colors.labelOnPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // ── Footer ──────────────────────────────────────────────────────
  footer: {
    textAlign: 'center',
    fontSize: 13,
    color: colors.slate400,
    marginTop: 28,
    lineHeight: 20,
  },
});
