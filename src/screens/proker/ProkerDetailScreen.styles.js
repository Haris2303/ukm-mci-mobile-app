import { StyleSheet } from 'react-native';

import { colors } from '@theme/colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.violet50 },

  iconSuccess: { color: colors.successIconBg },
  iconPrimary: { color: colors.blue600 },
  iconWarning: { color: colors.amber500 },
  iconLabel: { color: colors.labelOnPrimary },
  iconViolet: { color: colors.violet600 },
  textError: { color: colors.errorAccent, fontWeight: '700' },

  // Meta row (status + divisi)
  prokerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
    flexWrap: 'wrap',
  },
  metaStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  metaStatusText: { fontSize: 11, fontWeight: '800' },
  metaDivisiRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaDivisiText: { fontSize: 12, color: colors.slate500, fontWeight: '600' },

  // Progress Card
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    margin: 16,
    marginTop: 8,
    padding: 18,
    gap: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  progressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: { fontSize: 13, fontWeight: '700', color: colors.slate500 },
  progressBigPercent: { fontSize: 26, fontWeight: '900' },
  progressBarBg: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.slate100,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: 5 },
  progressMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressMetaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressMetaText: { fontSize: 11, color: colors.slate500 },

  // Info section
  infoSection: { paddingHorizontal: 16, gap: 10 },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 14,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.violet50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: { fontSize: 11, color: colors.slate400, fontWeight: '600' },
  infoValue: {
    fontSize: 13,
    color: colors.slate800,
    fontWeight: '700',
    marginTop: 2,
  },

  deskripsiCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 14,
    gap: 6,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  deskripsiLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deskripsiLabel: { fontSize: 12, fontWeight: '800', color: colors.slate500 },
  deskripsiText: { fontSize: 13, color: colors.slate600, lineHeight: 20 },

  // Tugas section
  tugasSection: { padding: 16, paddingTop: 8 },
  tugasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  tugasTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tugasSectionTitle: { fontSize: 14, fontWeight: '800', color: colors.slate800 },
  tugasSectionCount: { fontSize: 11, color: colors.slate400, fontWeight: '600' },

  tugasList: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  tugasItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.neutral200,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.slate300,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelesai: {
    backgroundColor: colors.successIconBg,
    borderColor: colors.successIconBg,
  },
  checkmark: { color: colors.labelOnPrimary, fontSize: 13, fontWeight: '900' },

  tugasNama: {
    flex: 1,
    fontSize: 13,
    color: colors.slate800,
    fontWeight: '600',
  },
  tugasNamaSelesai: {
    color: colors.slate400,
    textDecorationLine: 'line-through',
  },

  selesaiBadge: {
    backgroundColor: colors.green100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  selesaiBadgeText: { color: colors.successText, fontSize: 10, fontWeight: '800' },

  emptyTugas: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 14,
    padding: 30,
    alignItems: 'center',
    gap: 8,
  },
  emptyTugasText: { fontSize: 13, color: colors.slate400 },

  readOnlyBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: colors.infoBg,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.infoBorder,
    alignItems: 'flex-start',
  },
  readOnlyText: { flex: 1, fontSize: 11, color: colors.blue600, lineHeight: 16 },
});
