import { StyleSheet } from 'react-native';

import { colors, fontFamily, spacing } from '@theme/theme';

export const PRIMARY_COLOR = colors.primary;

export const styles = StyleSheet.create({
  wrapper: { gap: spacing[2] + 2 },

  // ── Skeleton ──
  skeletonCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },

  // ── Empty ──
  emptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  emptyIcon: { fontSize: 36 },
  emptyTitle: { fontSize: 14, fontFamily: fontFamily.regular, color: colors.neutral600 },
  emptyDesc: { fontSize: 11, fontFamily: fontFamily.light, color: colors.neutral400, marginTop: 2 },

  // ── Summary card ──
  summaryCard: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    padding: 18,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    gap: 14,
  },
  circle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.whiteAlpha8,
  },
  circle2: {
    position: 'absolute',
    bottom: -25,
    left: -25,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.tealAlpha10,
  },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
  summaryIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.whiteAlpha18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryLabel: { color: colors.textOnPrimary, fontSize: 14, fontFamily: fontFamily.regular },
  summaryHint: {
    color: colors.whiteAlpha70,
    fontSize: 11,
    fontFamily: fontFamily.light,
    marginTop: 1,
  },

  totalBadge: {
    backgroundColor: colors.whiteAlpha20,
    paddingHorizontal: spacing[3],
    paddingVertical: 5,
    borderRadius: 12,
    alignItems: 'center',
  },
  totalBadgeNum: { color: colors.textOnPrimary, fontSize: 18, fontFamily: fontFamily.regular },
  totalBadgeLabel: { color: colors.whiteAlpha80, fontSize: 9, fontFamily: fontFamily.regular },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.whiteAlpha12,
    borderRadius: 12,
    padding: 4,
  },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  statDivider: { width: 1, backgroundColor: colors.whiteAlpha20 },
  statNum: { color: colors.textOnPrimary, fontSize: 18, fontFamily: fontFamily.regular },
  statLabel: {
    color: colors.whiteAlpha85,
    fontSize: 10,
    fontFamily: fontFamily.regular,
    marginTop: 1,
  },

  // ── Preview list ──
  previewWrap: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 14,
    gap: spacing[2] + 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  previewTitle: {
    fontSize: 11,
    fontFamily: fontFamily.regular,
    color: colors.neutral400,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 8,
  },
  previewIconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: colors.badgeBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewBody: { flex: 1 },
  previewItemTitle: { fontSize: 13, fontFamily: fontFamily.regular, color: colors.textPrimary },
  previewItemMeta: {
    fontSize: 11,
    fontFamily: fontFamily.light,
    color: colors.neutral400,
    marginTop: 1,
  },
});
