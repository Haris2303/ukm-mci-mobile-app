import { StyleSheet } from 'react-native';

import { colors, shadow, spacing } from '@theme/theme';

export const SUCCESS_TEXT_COLOR = colors.successText;
export const NEUTRAL150_COLOR = colors.neutral50;
export const SLATE400_COLOR = colors.slate400;

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
  summaryCard: {
    backgroundColor: colors.warningBg,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.warningBorder,
  },
  summaryCardSuccess: { backgroundColor: colors.successBg, borderColor: colors.successBorder },
  summaryIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.warningIcon,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryIconBoxSuccess: { backgroundColor: colors.successIconBg },
  summaryContent: { flex: 1 },
  summaryLabel: { fontSize: 12, color: colors.warningText, fontWeight: '600' },
  summaryValue: { fontSize: 22, fontWeight: '900', color: colors.warningText, marginTop: 2 },
  summaryMeta: { fontSize: 11, color: colors.warningMuted, marginTop: 2 },
  timelineItem: { flexDirection: 'row', gap: spacing[3] },
  timelineLeft: { alignItems: 'center', width: 26 },
  timelineDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.successIconBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.green100,
  },
  timelineDotIcon: { color: colors.labelOnPrimary, fontSize: 12, fontWeight: '900' },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.slate200,
    marginTop: 4,
    marginBottom: -14,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 14,
    gap: 5,
    ...shadow.xs,
    marginBottom: spacing[2],
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPeriode: { fontSize: 14, fontWeight: '800', color: colors.slate800 },
  itemNominal: { fontSize: 18, fontWeight: '900', color: colors.warningText },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  catatanRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 5 },
  itemCatatan: { flex: 1, fontSize: 12, color: colors.slate500, fontStyle: 'italic' },
  itemMeta: { fontSize: 11, color: colors.slate400 },
  statusBadgeLunas: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: colors.successBg,
  },
  statusBadgeLunasText: { fontSize: 10, fontWeight: '800', color: colors.successText },
});
