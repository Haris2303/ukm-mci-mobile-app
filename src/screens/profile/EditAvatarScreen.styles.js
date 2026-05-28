import { StyleSheet } from 'react-native';

import { colors } from '@theme/colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.appBackground },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 0 },

  // ── Preview ──────────────────────────────────────────────────────
  previewSection: { alignItems: 'center', paddingVertical: 24, gap: 10 },
  previewAvatar: {
    borderWidth: 4,
    borderColor: colors.brand,
  },
  resetText: { fontSize: 13, color: colors.brand, fontWeight: '600' },

  // ── Section title ────────────────────────────────────────────────
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: colors.slate800 },

  // ── Upload photo ─────────────────────────────────────────────────
  photoRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  photoBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    elevation: 2,
  },
  photoBtnDisabled: { borderColor: colors.slate100, backgroundColor: colors.neutral50 },
  photoBtnIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.infoBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoBtnIconDisabled: { backgroundColor: colors.slate50 },
  photoBtnLabel: { fontSize: 14, fontWeight: '700', color: colors.brand },
  photoBtnLabelDisabled: { color: colors.slate400 },

  // ── Cooldown box ─────────────────────────────────────────────────
  cooldownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.warningBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.warningBorder,
  },
  cooldownText: { flex: 1, fontSize: 12, color: colors.warningText, fontWeight: '600' },

  // ── Last photo ───────────────────────────────────────────────────
  lastPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    elevation: 2,
  },
  lastPhotoBtnActive: { borderColor: colors.brand, backgroundColor: colors.infoBg },
  lastPhotoInfo: { flex: 1, gap: 2 },
  lastPhotoLabel: { fontSize: 14, fontWeight: '700', color: colors.slate800 },
  lastPhotoSub: { fontSize: 12, color: colors.slate500 },

  // ── Emoji grid ───────────────────────────────────────────────────
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  emojiCell: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.borderTransparent,
  },
  emojiCellActive: { borderColor: colors.brand },
  emojiBubble: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiChar: { fontSize: 24 },

  // ── Saving overlay ───────────────────────────────────────────────
  savingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.blackAlpha55,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
  },
  savingText: { color: colors.labelOnPrimary, fontSize: 16, fontWeight: '700' },
});
