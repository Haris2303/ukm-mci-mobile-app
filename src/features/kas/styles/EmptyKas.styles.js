import { StyleSheet } from 'react-native';

import { colors, spacing, radius } from '@theme/theme';

export const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    padding: spacing[8],
    alignItems: 'center',
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: '800' },
  desc: {
    fontSize: 13,
    color: colors.slate500,
    textAlign: 'center',
    lineHeight: 19,
  },
});
