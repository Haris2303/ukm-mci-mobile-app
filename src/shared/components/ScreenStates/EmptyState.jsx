import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors, spacing } from '@theme/theme';

export default function EmptyState({ iconName, title, description, style }) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconBox}>
        <FontAwesome5 name={iconName} size={32} color={colors.labelSecondary} solid />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing[8],
    gap: spacing[3],
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.fillTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.label,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: colors.labelSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
