import { StyleSheet } from 'react-native';

import { colors, shadow, spacing } from '@theme/theme';

export const DANGER_COLOR = colors.errorStrong;
export const BRAND_COLOR = colors.brand;

export const styles = StyleSheet.create({
  container: { gap: 14 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.slate500,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 6,
    marginBottom: 2,
  },
  bigSaldo: {
    backgroundColor: colors.brand,
    borderRadius: 24,
    padding: 26,
    overflow: 'hidden',
    position: 'relative',
    // Colored shadow — intentional, tidak pakai shadow preset
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  circle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.whiteAlpha8,
  },
  circle2: {
    position: 'absolute',
    bottom: -40,
    left: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.tealAlpha10,
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  label: { color: colors.whiteAlpha85, fontSize: 13, fontWeight: '700' },
  saldoValue: {
    color: colors.labelOnPrimary,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: spacing[2],
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  meta: { color: colors.whiteAlpha70, fontSize: 12 },
  breakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 6,
    ...shadow.xs,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.neutral200,
    marginHorizontal: spacing[3],
  },
  disclaimerBox: {
    backgroundColor: colors.neutral50,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  disclaimerText: { flex: 1, fontSize: 11, color: colors.slate500, lineHeight: 17 },
});
