import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../../theme/theme';

export default function ErrorState({ title = 'Gagal Memuat Data', message, onRetry, style }) {
  return (
    <View style={[styles.container, style]}>
      <FontAwesome5 name="frown" size={48} color={colors.labelSecondary} style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
      {onRetry && (
        <TouchableOpacity style={styles.btnRetry} onPress={onRetry} activeOpacity={0.8}>
          <Text style={styles.btnRetryText}>Coba Lagi</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[8],
    backgroundColor: colors.background,
  },
  icon: { marginBottom: spacing[2] },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.label,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: colors.labelSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  btnRetry: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: radius.md,
    marginTop: spacing[2],
  },
  btnRetryText: {
    color: colors.labelOnPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
});
