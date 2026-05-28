import { StyleSheet } from 'react-native';

import { colors } from '@theme/colors';

/** Warna icon per menu item — intentional: setiap menu punya accent color sendiri */
export const MENU_ICON_COLORS = {
  presensi: colors.blue600,
  kas: colors.emerald600,
  voting: colors.blue700,
  proker: colors.violet600,
  materi: colors.amber600,
  idcard: colors.cyan600,
  riwayat: colors.slate600,
  profil: colors.pink700,
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },

  // ── Header ──────────────────────────────────────────────────────
  header: {
    backgroundColor: colors.blue600,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 14,
    color: colors.whiteAlpha80,
    marginBottom: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.labelOnPrimary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: colors.whiteAlpha70,
  },
  avatarWrap: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.whiteAlpha50,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.whiteAlpha15,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green400,
  },
  statusText: {
    fontSize: 12,
    color: colors.labelOnPrimary,
    fontWeight: '600',
  },

  // ── Section ─────────────────────────────────────────────────────
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.slate800,
    marginBottom: 14,
  },

  // ── Menu Grid ───────────────────────────────────────────────────
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  menuItem: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  menuIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.gray700,
    textAlign: 'center',
  },

  // ── Info Card ───────────────────────────────────────────────────
  infoCard: {
    backgroundColor: colors.infoBg,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    gap: 14,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    alignItems: 'flex-start',
  },
  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.blue100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: { flex: 1 },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.infoText,
    marginBottom: 6,
  },
  infoDesc: {
    fontSize: 13,
    color: colors.blue500,
    lineHeight: 22,
  },

  // ── Logout Button ───────────────────────────────────────────────
  btnLogout: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: colors.red200,
  },
  btnLogoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.errorAccent,
  },
});
