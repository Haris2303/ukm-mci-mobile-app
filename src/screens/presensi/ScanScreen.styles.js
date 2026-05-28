import { StyleSheet } from 'react-native';

import { colors } from '@theme/colors';

const VIEWFINDER_SIZE = 260;

export const styles = StyleSheet.create({
  iconSuccess: { color: colors.successText },
  iconPrimary: { color: colors.blue600 },
  iconWarning: { color: colors.amber500 },
  iconLabel: { color: colors.labelOnPrimary },

  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.appBackground,
    padding: 32,
  },

  // Top bar
  topBar: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: colors.backgroundDark,
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.labelOnPrimary,
    marginBottom: 4,
  },
  topBarSub: {
    fontSize: 13,
    color: colors.whiteAlpha60,
  },

  // Kamera
  cameraWrapper: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },

  // Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
  },
  overlayRow: {
    flex: 1,
    backgroundColor: colors.blackAlpha55,
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: VIEWFINDER_SIZE,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: colors.blackAlpha55,
  },

  // Viewfinder
  viewfinder: {
    width: VIEWFINDER_SIZE,
    height: VIEWFINDER_SIZE,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: colors.blue600,
    borderRadius: 3,
  },

  // Processing
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.blackAlpha75,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  processingText: {
    color: colors.labelOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },

  // Bottom bar
  bottomBar: {
    backgroundColor: colors.backgroundDark,
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 8,
  },
  bottomText: {
    color: colors.whiteAlpha80,
    fontSize: 14,
    textAlign: 'center',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.whiteAlpha10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tipText: {
    color: colors.whiteAlpha70,
    fontSize: 12,
  },

  // Hasil scan
  resultContainer: {
    flex: 1,
    backgroundColor: colors.appBackground,
    justifyContent: 'center',
    padding: 28,
    gap: 20,
  },
  resultCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    gap: 10,
  },
  cardSuccess: {
    backgroundColor: colors.successBg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.successBorder,
  },
  cardError: {
    backgroundColor: colors.red50b,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.errorBorder,
  },
  resultTitle: { fontSize: 22, fontWeight: '800' },
  textSuccess: { color: colors.successte },
  textError: { color: colors.errorStrong },
  resultMessage: {
    fontSize: 15,
    color: colors.slate600,
    textAlign: 'center',
    lineHeight: 24,
  },
  detailBox: {
    marginTop: 8,
    backgroundColor: colors.blackAlpha5,
    borderRadius: 12,
    padding: 14,
    width: '100%',
  },
  detailText: {
    fontSize: 14,
    color: colors.slate600,
    lineHeight: 24,
    textAlign: 'center',
  },

  // Buttons
  btnPrimary: {
    backgroundColor: colors.blue600,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: colors.blue600,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  btnPrimaryText: { color: colors.labelOnPrimary, fontSize: 16, fontWeight: '700' },
  btnPrimaryRow: { flexDirection: 'row', gap: 10, justifyContent: 'center' },

  // Izin kamera
  permissionIcon: { marginBottom: 20 },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.slate800,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionDesc: {
    fontSize: 14,
    color: colors.slate500,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
});
