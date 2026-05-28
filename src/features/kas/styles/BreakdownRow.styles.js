import { StyleSheet } from 'react-native';

import { colors, spacing } from '@theme/theme';

// Warna data viz per kategori — hardcoded by design, bukan semantic token
export const CATEGORY_COLORS = {
  iuran: colors.blue500,
  donasi: colors.emerald500,
  expense: colors.errorAccent,
  total: colors.brand,
};

export const BRAND_COLOR = colors.brand;
export const SUCCESS_TEXT_COLOR = colors.successText;
export const DANGER_STRONG_COLOR = colors.errorStrong;

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[3],
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelBox: { flex: 1 },
  label: { fontSize: 13, fontWeight: '700', color: colors.slate600 },
  labelTotal: { fontWeight: '800', color: colors.slate800 },
  sign: { fontSize: 10, color: colors.slate400, marginTop: 1 },
  value: { fontSize: 14, fontWeight: '800' },
  valueTotal: { fontSize: 17, fontWeight: '900' },
});
