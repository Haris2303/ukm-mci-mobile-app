import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, shadow, spacing } from '../../theme/theme';

/**
 * ListSection — iOS Settings-style grouped list.
 *
 * Struktur:
 *   <ListSection header="PENGATURAN" footer="Catatan penting di bawah.">
 *     <ListItem ... />
 *     <ListItem ... />
 *   </ListSection>
 *
 * Props:
 *   header   string — label kecil di atas grup (uppercase, abu-abu)
 *   footer   string — catatan kecil di bawah grup
 *   style    ViewStyle override untuk container kartu
 *   children ListItem | ReactNode
 */
export default function ListSection({ header, footer, style, children }) {
  return (
    <View style={styles.wrapper}>
      {header ? (
        <Text style={styles.header}>{header.toUpperCase()}</Text>
      ) : null}

      <View
        style={[styles.card, style]}
        experimental_continuousCorners={true}
      >
        {children}
      </View>

      {footer ? (
        <Text style={styles.footer}>{footer}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing[4],
  },

  header: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.labelSecondary,
    letterSpacing: 0.5,
    marginBottom: spacing[1],
    marginHorizontal: spacing[4],
    marginTop: spacing[1],
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadow.sm,
  },

  footer: {
    fontSize: 12,
    color: colors.labelSecondary,
    marginTop: spacing[1],
    marginHorizontal: spacing[4],
    lineHeight: 17,
  },
});
