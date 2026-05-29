import { StyleSheet } from 'react-native';

import { colors } from '@theme/colors';

export const RefreshControlColor = colors.blue600;

export const STATUS_CONFIG = {
  aktif: { label: 'Berlangsung', color: colors.successMuted, bg: colors.green100 },
  selesai: { label: 'Selesai', color: colors.blue700, bg: colors.blue100 },
  draft: { label: 'Akan Datang', color: colors.warningText, bg: colors.warningBg },
  tie: { label: '⚖️ Seri', color: colors.amber600, bg: colors.warningBg },
};

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.appBackground },

  header: {
    backgroundColor: colors.blue600,
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.labelOnPrimary,
    marginBottom: 4,
  },
  headerSub: { fontSize: 13, color: colors.whiteAlpha75 },

  list: { padding: 20, gap: 16 },
  listEmpty: { flexGrow: 1, justifyContent: 'center' },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  accent: { width: 6 },
  cardContent: { flex: 1, padding: 18, gap: 8 },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeDot: { width: 7, height: 7, borderRadius: 4 },
  badgeText: { fontSize: 11, fontWeight: '700' },

  votedBadge: {
    backgroundColor: colors.successBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.successBorder,
  },
  votedText: { fontSize: 11, fontWeight: '700', color: colors.successText },

  posisi: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.slate400,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  judul: { fontSize: 17, fontWeight: '800', color: colors.slate800, lineHeight: 24 },

  metaRow: { flexDirection: 'row', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.slate100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chipLabel: { fontSize: 12, color: colors.slate500, fontWeight: '600' },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  waktuRow: { flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 },
  waktu: { fontSize: 12, color: colors.slate400, flex: 1 },
  btnDetail: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10 },
  btnDetailText: { color: colors.labelOnPrimary, fontSize: 12, fontWeight: '700' },

  empty: { alignItems: 'center', gap: 12, padding: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.slate800 },
  emptySub: { fontSize: 14, color: colors.slate400, textAlign: 'center' },
});
