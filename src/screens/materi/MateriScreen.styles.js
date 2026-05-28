import { Dimensions, StyleSheet } from 'react-native';

import { colors } from '@theme/colors';

export const screenWidth = Dimensions.get('window').width;

/** Warna aksen kartu materi berdasarkan jenis (umum vs divisi) */
export const MATERI_ACCENT = {
  umum: colors.emerald500, // #10b981
  divisi: colors.brand, // #1a4ff5
};

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.appBackground },

  // ── Stats Strip ─────────────────────────────────────────────────
  statsStrip: {
    backgroundColor: colors.blue600,
    paddingHorizontal: 24,
    paddingTop: 6,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  statsText: { fontSize: 13, color: colors.whiteAlpha80 },

  // ── Filter Bar ──────────────────────────────────────────────────
  filterBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: -16,
    borderRadius: 16,
    padding: 5,
    gap: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 5,
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
    gap: 4,
  },
  filterTabActive: { backgroundColor: colors.brand },
  filterLabel: { fontSize: 11, fontWeight: '700', color: colors.slate500 },
  filterLabelActive: { color: colors.labelOnPrimary },
  filterBadge: {
    minWidth: 20,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.slate100,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeActive: { backgroundColor: colors.whiteAlpha25 },
  filterBadgeText: { fontSize: 10, fontWeight: '800', color: colors.slate500 },
  filterBadgeTextActive: { color: colors.labelOnPrimary },

  // ── Content ─────────────────────────────────────────────────────
  content: { flex: 1 },
  page: { width: screenWidth },
  contentInner: { padding: 16, paddingTop: 18, gap: 12 },

  // ── Card ────────────────────────────────────────────────────────
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  cardAccent: { width: 5 },
  cardBody: { flex: 1, padding: 16, gap: 8 },

  jenisBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
  },
  jenisBadgeText: { fontSize: 10, fontWeight: '800' },

  cardTitle: { fontSize: 15, fontWeight: '800', color: colors.slate800, lineHeight: 21 },
  cardDesc: { fontSize: 12, color: colors.slate500, lineHeight: 18 },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  metaText: { fontSize: 11, color: colors.slate400 },
  metaDot: { fontSize: 11, color: colors.slate300 },

  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 8 },

  btnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 7,
  },
  btnDisabled: { opacity: 0.7 },
  btnPrimaryText: { color: colors.labelOnPrimary, fontWeight: '700', fontSize: 12 },

  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.infoBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.infoBorder,
  },
  btnSecondaryText: { color: colors.brand, fontWeight: '700', fontSize: 12 },

  noContentBox: {
    backgroundColor: colors.slate50,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
  },
  noContentRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  noContentText: { fontSize: 11, color: colors.slate400 },

  // ── Empty State ─────────────────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    padding: 40,
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: 20,
  },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: colors.slate800 },
  emptyDesc: { fontSize: 13, color: colors.slate500, textAlign: 'center', lineHeight: 19 },
});
