import React from 'react';
import { View, StyleSheet } from 'react-native';

import { colors } from '@theme/theme';

/**
 * Divider — iOS-style separator tipis.
 *
 * Props:
 *   inset   number — indentasi kiri (misal: 56 untuk sejajar dengan teks setelah icon)
 *   style   ViewStyle override
 */
export default function Divider({ inset = 0, style }) {
  return <View style={[styles.line, { marginLeft: inset }, style]} />;
}

const styles = StyleSheet.create({
  line: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separatorOpaque,
  },
});
