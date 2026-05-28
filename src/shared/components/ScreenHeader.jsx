import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors, spacing } from '@theme/theme';

export default function ScreenHeader({ title, subtitle, backgroundColor, children, style }) {
  return (
    <View style={[styles.header, backgroundColor ? { backgroundColor } : null, style]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: spacing[6],
    paddingHorizontal: spacing[6],
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.labelOnPrimary,
    marginBottom: spacing[1],
  },
  subtitle: {
    fontSize: 13,
    color: colors.whiteAlpha75,
  },
});
