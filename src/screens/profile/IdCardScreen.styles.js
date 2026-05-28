import { StyleSheet } from 'react-native';

import { colors } from '@theme/colors';

export const CARD_WIDTH = 300;

/** Gradient header ID Card saat ada background image (mode gelap) */
export const CARD_GRADIENT_BG = [colors.blackAlpha45, colors.border];
/** Gradient header ID Card default (mode biru) */
export const CARD_GRADIENT_BLUE = [colors.brand, colors.brandLight];
/** Gradient foto inisial */
export const PHOTO_GRADIENT = [colors.brand, colors.brandLight];

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.appBackground },

  scrollContent: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // ── Shadow wrapper ────────────────────────────────────────────
  cardShadow: {
    borderRadius: 20,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.11,
    shadowRadius: 20,
    elevation: 6,
  },

  // ── Card ─────────────────────────────────────────────────────
  card: {
    width: CARD_WIDTH,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },

  // ── Header ────────────────────────────────────────────────────
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
  },
  logoBox: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: colors.whiteAlpha20,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  logoText: { color: colors.labelOnPrimary, fontSize: 15, fontWeight: '800' },
  orgLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.whiteAlpha75,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  orgTitle: { fontSize: 11, fontWeight: '700', color: colors.labelOnPrimary, lineHeight: 15 },

  // ── Photo ─────────────────────────────────────────────────────
  photoWrap: { paddingTop: 22, paddingBottom: 14, alignItems: 'center' },
  photoShadow: {
    borderRadius: 14,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  photo: {
    width: 96,
    height: 96,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: colors.brand,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photoBg: { borderColor: colors.labelOnPrimary },
  inisial: { color: colors.labelOnPrimary, fontSize: 34, fontWeight: '800' },
  emojiAvatar: { fontSize: 42 },

  // ── Info ──────────────────────────────────────────────────────
  infoSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
    gap: 8,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.slate900,
    textAlign: 'center',
    lineHeight: 22,
  },
  cardNameBg: { color: colors.labelOnPrimary },

  rolePill: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: colors.blueLight,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.blue200,
  },
  rolePillBg: {
    backgroundColor: colors.whiteAlpha18,
    borderColor: colors.whiteAlpha35,
  },
  rolePillText: { fontSize: 10, fontWeight: '600', color: colors.brand },
  rolePillTextBg: { color: colors.labelOnPrimary },

  divisiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.slate50,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.slate200,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  divisiRowBg: {
    backgroundColor: colors.whiteAlpha18,
    borderColor: colors.whiteAlpha25,
  },
  divisiLabel: {
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: colors.slate400,
  },
  divisiLabelBg: { color: colors.whiteAlpha70 },
  divisiValue: { fontSize: 12, fontWeight: '600', color: colors.slate700 },
  divisiValueBg: { color: colors.labelOnPrimary },

  // ── Divider ───────────────────────────────────────────────────
  cardDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.slate200,
    marginHorizontal: 20,
  },
  cardDividerBg: {
    backgroundColor: colors.whiteAlpha25,
    marginHorizontal: 24,
  },

  // ── QR ────────────────────────────────────────────────────────
  qrWrap: { paddingTop: 18, paddingBottom: 20, alignItems: 'center', gap: 10 },
  scanLabel: {
    fontSize: 8.5,
    fontWeight: '600',
    color: colors.slate400,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  scanLabelBg: { color: colors.whiteAlpha75 },
  qrBox: { borderRadius: 8, overflow: 'hidden' },
  qrBoxBg: {
    backgroundColor: colors.whiteAlpha92,
    borderRadius: 12,
    padding: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  qrEmpty: {
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.slate100,
    borderRadius: 8,
  },
  qrEmptyText: { fontSize: 20, fontWeight: '800', color: colors.slate300 },

  // ── Footer ────────────────────────────────────────────────────
  cardFooterWrap: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.slate100,
  },
  cardFooterWrapBg: { borderTopColor: colors.whiteAlpha20 },
  footerText: {
    fontSize: 8,
    color: colors.slate300,
    textAlign: 'center',
    letterSpacing: 0.6,
  },
  footerTextBg: { color: colors.whiteAlpha55 },

  // ── Share button ──────────────────────────────────────────────
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 28,
    gap: 10,
    marginTop: 24,
    width: CARD_WIDTH,
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  shareBtnText: { color: colors.labelOnPrimary, fontSize: 15, fontWeight: '700' },

  // ── Info box ──────────────────────────────────────────────────
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.infoBg,
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.infoBorder,
    width: CARD_WIDTH,
  },
  infoText: { flex: 1, fontSize: 12, color: colors.infoText, lineHeight: 18 },
});
