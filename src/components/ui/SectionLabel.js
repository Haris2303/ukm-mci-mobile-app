import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme/theme';

/**
 * SectionLabel — iOS-style section header label.
 * Teks uppercase kecil berwarna abu sebelum grup konten.
 *
 * Props:
 *   style   TextStyle override
 *   children string
 */
export default function SectionLabel({ style, children }) {
  return (
    <Text style={[styles.label, style]}>
      {typeof children === 'string' ? children.toUpperCase() : children}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.labelSecondary,
    letterSpacing: 0.5,
    marginBottom: spacing[1],
    marginHorizontal: spacing[4],
    marginTop: spacing[3],
  },
});
