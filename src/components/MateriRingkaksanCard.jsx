// src/components/MateriRingkasanCard.jsx
// Card preview materi untuk ditampilkan di HomeScreen.
// Menampilkan 2-3 materi terbaru dengan tap-to-detail.

import React, { memo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

// useMateri pakai queryKey ['materi'] yang sama dengan MateriScreen →
// React Query otomatis share satu cache entry. Kalau user sudah buka Home
// sebelumnya, MateriScreen akan langsung tampil tanpa loading.
import { useMateri } from '@features/materi/hooks/useMateri';

import { PRIMARY_COLOR, styles } from './styles/MateriRingkasanCard.styles';
import AppIcon from './ui/Icon';

function MateriRingkasanCard({ onPress }) {
  const { data, isLoading } = useMateri();

  // ── Loading skeleton ─────────────────────────────────────
  if (isLoading) {
    return (
      <View style={styles.skeletonCard}>
        <ActivityIndicator color={PRIMARY_COLOR} />
      </View>
    );
  }

  // ── Kosong ───────────────────────────────────────────────
  if (!data || data.total === 0) {
    return (
      <TouchableOpacity style={styles.emptyCard} onPress={onPress} activeOpacity={0.9}>
        <Text style={styles.emptyIcon}>📚</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.emptyTitle}>Belum Ada Materi</Text>
          <Text style={styles.emptyDesc}>Materi pembelajaran akan muncul di sini.</Text>
        </View>
      </TouchableOpacity>
    );
  }

  const previewMateris = data.materi.slice(0, 3);

  return (
    <View style={styles.wrapper}>
      {/* ── Header ringkasan ────────────────────────── */}
      <TouchableOpacity style={styles.summaryCard} onPress={onPress} activeOpacity={0.92}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        <View style={styles.summaryHeader}>
          <View style={styles.summaryIconBox}>
            <AppIcon name="book" size={22} color="textOnPrimary" solid />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryLabel}>Materi Pembelajaran</Text>
            <Text style={styles.summaryHint}>Untuk Anda dan divisi Anda</Text>
          </View>
          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeNum}>{data.total}</Text>
            <Text style={styles.totalBadgeLabel}>materi</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{data.jumlah_umum}</Text>
            <Text style={styles.statLabel}>Umum</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{data.jumlah_divisi}</Text>
            <Text style={styles.statLabel}>Divisi Saya</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* ── Preview 3 materi terbaru ───────────────── */}
      <View style={styles.previewWrap}>
        <Text style={styles.previewTitle}>Terbaru</Text>
        {previewMateris.map((materi, idx) => (
          <TouchableOpacity
            key={materi.id ?? `preview-${idx}`}
            style={styles.previewItem}
            onPress={onPress}
            activeOpacity={0.85}
          >
            <View style={styles.previewIconBox}>
              <AppIcon
                name={materi.has_file ? 'file-alt' : 'link'}
                size={16}
                color="primary"
                solid
              />
            </View>
            <View style={styles.previewBody}>
              <Text style={styles.previewItemTitle} numberOfLines={1}>
                {materi.judul}
              </Text>
              <Text style={styles.previewItemMeta} numberOfLines={1}>
                {materi.is_umum ? 'Umum' : (materi.divisi?.nama ?? 'Divisi')} · {materi.tanggal}
              </Text>
            </View>
            <AppIcon name="chevron-right" size={14} color="neutral300" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default memo(MateriRingkasanCard);
