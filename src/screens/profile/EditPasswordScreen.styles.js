import { StyleSheet } from 'react-native';

import { colors } from '@theme/colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.appBackground },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 16 },

  // ── Info box ────────────────────────────────────────────────────
  infoBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: colors.infoBg,
    borderRadius: 14,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.infoBorder,
    alignItems: 'flex-start',
  },
  infoText: { flex: 1, fontSize: 13, color: colors.blue700, lineHeight: 19 },

  // ── Form card ───────────────────────────────────────────────────
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 6,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.neutral200,
    marginHorizontal: 14,
  },

  // ── Field ───────────────────────────────────────────────────────
  fieldWrapper: { paddingHorizontal: 14, paddingVertical: 14, gap: 8 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.slate400,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.slate50,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 48,
  },
  inputRowError: { borderColor: colors.errorBorder, backgroundColor: colors.red50 },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.slate800,
    fontWeight: '500',
  },
  eyeBtn: { padding: 6 },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  errorText: { fontSize: 12, color: colors.errorAccent, fontWeight: '600' },

  // ── Password strength ────────────────────────────────────────────
  strengthBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    elevation: 2,
  },
  strengthBars: { flex: 1, flexDirection: 'row', gap: 4 },
  strengthBar: { flex: 1, height: 5, borderRadius: 3 },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '800',
    minWidth: 72,
    textAlign: 'right',
  },
});
