import { StyleSheet } from 'react-native';

import { colors } from '@theme/colors';

export const EMPTY_KAS_COLOR = {
  successBg: colors.successBg,
  successIconBg: colors.successIconBg,
};

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
  summaryIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.warningIcon,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContent: { flex: 1 },
  summaryLabel: { fontSize: 12, color: colors.warningText, fontWeight: '600' },
  summaryValue: { fontSize: 22, fontWeight: '900', color: colors.warningText, marginTop: 2 },
  summaryMeta: { fontSize: 11, color: colors.warningMuted, marginTop: 2 },
  infoBox: {
    backgroundColor: colors.infoBg,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.infoBorder,
  },
  infoText: { flex: 1, fontSize: 12, color: colors.infoText, lineHeight: 18 },
});
