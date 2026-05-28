import { StyleSheet } from 'react-native';

import { colors } from '@theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },

  primary: { color: colors.blue600 },

  // List
  listContent: {
    padding: 20,
    gap: 14,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  // Card
  card: {
    flexDirection: 'row',
    gap: 14,
  },
  cardLeft: {
    alignItems: 'center',
    width: 20,
    paddingTop: 4,
  },
  statusDotBox: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  dotHadir: { backgroundColor: colors.successBorder, borderColor: colors.successIconBg },
  dotLain: { backgroundColor: colors.amber200, borderColor: colors.amber500 },
  timeLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.slate200,
    marginTop: 4,
    borderRadius: 2,
  },

  cardBody: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  agendaName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.slate800,
    lineHeight: 21,
  },

  // Badge status
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeHadir: { backgroundColor: colors.green100 },
  badgeLain: { backgroundColor: colors.yellow100 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  badgeTextHadir: { color: colors.successText },
  badgeTextLain: { color: colors.warningText },

  // Meta info
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  metaText: { fontSize: 13, color: colors.slate500, flex: 1 },
});
