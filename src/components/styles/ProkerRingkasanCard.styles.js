import { StyleSheet } from 'react-native';

import { colors, shadow } from '@theme/theme';

export const PURPLE = colors.violet600;
export const SYSTEM_COLOR = {
  success: colors.systemGreen,
  danger: colors.systemRed,
  warning: colors.systemOrange,
};

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadow.sm,
  },

  loadingCard: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },

  // ── Empty ──
  emptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
  },
  emptyTitle: { fontSize: 14, fontWeight: '600', color: colors.label, marginBottom: 2 },
  emptyDesc: { fontSize: 12, color: colors.labelSecondary },

  // ── Header ──
  header: {
    backgroundColor: PURPLE,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.whiteAlpha20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 15, fontWeight: '700', color: colors.labelOnPrimary },
  headerSub: { fontSize: 11, color: colors.whiteAlpha70, marginTop: 1 },
  totalBadge: {
    backgroundColor: colors.whiteAlpha20,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
  },
  totalNum: { fontSize: 17, fontWeight: '700', color: colors.labelOnPrimary },
  totalLabel: { fontSize: 9, color: colors.whiteAlpha75, marginTop: 1 },

  // ── Stat row ──
  statRow: {
    flexDirection: 'row',
    backgroundColor: colors.violet700,
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 2,
    gap: 0,
  },
  statPill: { flex: 1, alignItems: 'center', gap: 2, paddingVertical: 6 },
  statSep: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.whiteAlpha20,
    marginVertical: 6,
  },
  statNum: { fontSize: 16, fontWeight: '700', color: colors.labelOnPrimary },
  statLabel: { fontSize: 9, color: colors.whiteAlpha75 },

  // ── Late bar ──
  lateBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.redAlpha10,
    marginHorizontal: 12,
    marginBottom: 2,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  lateText: { fontSize: 12, color: colors.error, fontWeight: '600' },

  // ── Divider ──
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.neutral200,
    marginTop: 8,
  },

  // ── List ──
  listWrap: { paddingHorizontal: 14, paddingTop: 4 },

  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingVertical: 12,
    gap: 12,
  },
  rowSep: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.neutral200,
  },
  rowAccent: { width: 3, borderRadius: 2 },
  rowBody: { flex: 1, gap: 5 },

  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowName: { fontSize: 14, fontWeight: '600', color: colors.label, flex: 1 },
  rowPct: { fontSize: 13, fontWeight: '700', marginLeft: 8 },

  progressBg: {
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.neutral100,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },

  rowMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowJenis: { fontSize: 11, color: colors.labelSecondary },
  rowSisa: { fontSize: 11, color: colors.labelSecondary },

  lateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.redAlpha10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  lateChipText: { fontSize: 10, color: colors.error, fontWeight: '600' },
});
