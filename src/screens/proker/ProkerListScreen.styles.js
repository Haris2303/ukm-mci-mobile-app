import { StyleSheet, Dimensions } from 'react-native';

import { colors } from '@theme/colors';

export const screenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.violet50 },

  iconSuccess: { color: colors.successIconBg },
  iconDanger: { color: colors.errorAccent },
  iconPrimary: { color: colors.blue500 },
  iconWarning: { color: colors.amber500 },
  iconLabel: { color: colors.labelOnPrimary },
  iconViolet: { color: colors.violet600 },

  header: {
    backgroundColor: colors.violet600,
    paddingTop: 14,
    paddingBottom: 22,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    gap: 8,
  },
  headerSub: { fontSize: 13, color: colors.whiteAlpha75 },

  terlambatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.redAlpha25,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  terlambatHeaderText: { color: colors.labelOnPrimary, fontSize: 11, fontWeight: '700' },

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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    gap: 2,
  },
  filterTabActive: { backgroundColor: colors.violet600 },
  filterLabel: { fontSize: 10, fontWeight: '700', color: colors.slate500 },
  filterLabelActive: { color: colors.labelOnPrimary },
  filterBadge: {
    minWidth: 18,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.slate100,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeActive: { backgroundColor: colors.whiteAlpha25 },
  filterBadgeText: { fontSize: 9, fontWeight: '800', color: colors.slate500 },
  filterBadgeTextActive: { color: colors.labelOnPrimary },

  content: { flex: 1 },
  page: { width: screenWidth },
  contentInner: { padding: 16, paddingTop: 18, gap: 12 },

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
  cardBody: { flex: 1, padding: 14, gap: 8 },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 10 },
  statusBadgeText: { fontSize: 10, fontWeight: '800' },

  lateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.errorBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  lateBadgeText: { color: colors.errorStrong, fontSize: 9, fontWeight: '800' },

  cardTitle: { fontSize: 15, fontWeight: '800', color: colors.slate800, lineHeight: 21 },

  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  divisiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.violet50,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  divisiBadgeText: { fontSize: 11, color: colors.violet600, fontWeight: '700' },
  picRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  picText: { fontSize: 11, color: colors.slate400 },

  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.slate100,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: 4 },
  progressText: {
    fontSize: 12,
    fontWeight: '900',
    minWidth: 35,
    textAlign: 'right',
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.neutral200,
  },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerText: { fontSize: 11, color: colors.slate500 },

  emptyState: {
    alignItems: 'center',
    padding: 40,
    gap: 8,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
  },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: colors.slate800 },
  emptyDesc: {
    fontSize: 13,
    color: colors.slate500,
    textAlign: 'center',
    lineHeight: 19,
  },
});
