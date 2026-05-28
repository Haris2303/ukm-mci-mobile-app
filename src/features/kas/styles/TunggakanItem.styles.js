import { StyleSheet } from 'react-native';

import { colors, shadow, radius } from '@theme/theme';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadow.xs,
  },
  accent: { width: 4, backgroundColor: colors.warningIcon },
  body: { flex: 1, padding: 14, gap: 6 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periode: { fontSize: 14, fontWeight: '800', color: colors.slate800 },
  nominal: { fontSize: 18, fontWeight: '900', color: colors.warningText },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  catatanRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 5 },
  catatan: { flex: 1, fontSize: 12, color: colors.slate500, fontStyle: 'italic' },
  meta: { fontSize: 11, color: colors.slate400 },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: radius.md,
    backgroundColor: colors.warningBg,
  },
  badgeText: { fontSize: 10, fontWeight: '800', color: colors.warningText },
});
