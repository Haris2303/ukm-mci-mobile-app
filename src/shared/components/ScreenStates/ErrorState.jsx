import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { colors, spacing, radius } from '@theme/theme';

import { useNetworkStatus } from '../../hooks/useNetworkStatus';

// ── Konfigurasi per tipe error ────────────────────────────────────────────────
const ERROR_CONFIG = {
  'no-internet': {
    icon: 'plug',
    iconColor: colors.slate400,
    title: 'Tidak Ada Koneksi',
    message: 'Periksa koneksi internet Anda dan coba lagi.',
  },
  'server-error': {
    icon: 'server',
    iconColor: colors.errorAccent,
    title: 'Server Bermasalah',
    message: 'Server sedang mengalami gangguan. Coba beberapa saat lagi.',
  },
  'not-found': {
    icon: 'ghost',
    iconColor: colors.slate400,
    title: 'Tidak Ditemukan',
    message: 'Halaman ini tidak ada atau telah dipindahkan.',
  },
  generic: {
    icon: 'frown',
    iconColor: colors.labelSecondary,
    title: 'Gagal Memuat Data',
    message: null,
  },
};

// ── Utility: klasifikasi error dari objek error ───────────────────────────────
export function classifyError(error, isOffline = false) {
  if (isOffline) return 'no-internet';
  if (!error) return 'generic';
  const msg = (error.message ?? '').toLowerCase();
  if (msg.includes('network request failed') || msg.includes('failed to fetch')) {
    return 'no-internet';
  }
  if (error.status === 404) return 'not-found';
  if (error.status >= 500 || msg.includes('server error')) return 'server-error';
  return 'generic';
}

// ── Komponen ──────────────────────────────────────────────────────────────────
/**
 * Props:
 *   error?   Error  — objek error untuk auto-detect tipe (gunakan ini)
 *   type?    'no-internet' | 'server-error' | 'not-found' | 'generic'
 *   title?   string — override judul default
 *   message? string — override pesan default
 *   onRetry? () => void
 *   style?   ViewStyle
 */
export default function ErrorState({ title, message, onRetry, style, error, type }) {
  const { isOffline } = useNetworkStatus();

  const resolvedType = type ?? classifyError(error, isOffline);
  const config = ERROR_CONFIG[resolvedType] ?? ERROR_CONFIG.generic;

  const displayTitle = title ?? config.title;
  const displayMessage = message ?? config.message;

  return (
    <View style={[styles.container, style]}>
      <FontAwesome5
        name={config.icon}
        size={48}
        color={config.iconColor}
        style={styles.icon}
        solid
      />
      <Text style={styles.title}>{displayTitle}</Text>
      {displayMessage ? <Text style={styles.message}>{displayMessage}</Text> : null}
      {onRetry ? (
        <TouchableOpacity style={styles.btnRetry} onPress={onRetry} activeOpacity={0.8}>
          <Text style={styles.btnRetryText}>Coba Lagi</Text>
        </TouchableOpacity>
      ) : null}
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
