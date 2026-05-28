// src/components/ProkerRingkasanCard.jsx
// Card preview program kerja untuk ditampilkan di HomeScreen.
// Menggunakan useProker() — shared cache dengan ProkerListScreen →
// satu cache entry, tidak ada duplikasi request.

import React, { memo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

import { useProker } from '@features/proker/hooks/useProker';

import { PURPLE, styles, SYSTEM_COLOR } from './styles/ProkerRingkasanCard.styles';
import AppIcon from './ui/Icon';

function ProkerRingkasanCard({ onPress }) {
  const { data, isLoading } = useProker();

  // ── Loading skeleton — hanya tampil saat cache kosong (fetch pertama) ────
  if (isLoading) {
    return (
      <View style={[styles.card, styles.loadingCard]}>
        <ActivityIndicator color={PURPLE} />
      </View>
    );
  }

  // ── Kosong ────────────────────────────────────────────────────────────────
  if (!data || data.statistik.total === 0) {
    return (
      <TouchableOpacity
        style={[styles.card, styles.emptyCard]}
        onPress={onPress}
        activeOpacity={0.88}
        experimental_continuousCorners={true}
      >
        <AppIcon name="clipboard-list" size={24} color="violet600" />
        <View style={{ flex: 1 }}>
          <Text style={styles.emptyTitle}>Belum Ada Proker</Text>
          <Text style={styles.emptyDesc}>Program kerja akan muncul di sini.</Text>
        </View>
        <AppIcon name="chevron-right" size={13} color="separatorOpaque" />
      </TouchableOpacity>
    );
  }

  const { statistik, proker } = data;
  const preview = proker.slice(0, 2);

  return (
    <View style={styles.card} experimental_continuousCorners={true}>
      {/* ── Header ─────────────────────────────────────── */}
      <TouchableOpacity style={styles.header} onPress={onPress} activeOpacity={0.88}>
        <View style={styles.headerIconBox}>
          <AppIcon name="tasks" size={16} color="labelOnPrimary" solid />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Program Kerja</Text>
          <Text style={styles.headerSub}>Tracking divisi & UKM</Text>
        </View>
        <View style={styles.totalBadge}>
          <Text style={styles.totalNum}>{statistik.total}</Text>
          <Text style={styles.totalLabel}>proker</Text>
        </View>
      </TouchableOpacity>

      {/* ── Stat row ───────────────────────────────────── */}
      <View style={styles.statRow}>
        <StatPill iconName="clipboard-list" label="Planning" value={statistik.planning} />
        <View style={styles.statSep} />
        <StatPill iconName="rocket" label="Berjalan" value={statistik.active} />
        <View style={styles.statSep} />
        <StatPill iconName="check-circle" label="Selesai" value={statistik.completed} />
      </View>

      {statistik.terlambat > 0 && (
        <View style={styles.lateBar}>
          <AppIcon name="exclamation-triangle" size={10} color="error" />
          <Text style={styles.lateText}>{statistik.terlambat} proker terlambat</Text>
        </View>
      )}

      {/* ── Separator ──────────────────────────────────── */}
      <View style={styles.divider} />

      {/* ── Preview items ──────────────────────────────── */}
      <View style={styles.listWrap}>
        {preview.map((p, i) => (
          <ProkerRow
            key={p.id ?? i}
            proker={p}
            onPress={onPress}
            showSep={i < preview.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

// ─── StatPill ─────────────────────────────────────────────────────────────────
function StatPill({ iconName, label, value }) {
  return (
    <View style={styles.statPill}>
      <AppIcon name={iconName} size={11} color="whiteAlpha75" />
      <Text style={styles.statNum}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─── ProkerRow ────────────────────────────────────────────────────────────────
function ProkerRow({ proker, onPress, showSep }) {
  const progressColor =
    proker.warna_progress === 'success'
      ? SYSTEM_COLOR.success
      : proker.warna_progress === 'danger'
        ? SYSTEM_COLOR.danger
        : proker.warna_progress === 'warning'
          ? SYSTEM_COLOR.warning
          : PURPLE;

  return (
    <TouchableOpacity
      style={[styles.row, showSep && styles.rowSep]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Color accent */}
      <View style={[styles.rowAccent, { backgroundColor: progressColor }]} />

      <View style={styles.rowBody}>
        {/* Name + % */}
        <View style={styles.rowTop}>
          <Text style={styles.rowName} numberOfLines={1}>
            {proker.nama_proker}
          </Text>
          <Text style={[styles.rowPct, { color: progressColor }]}>{proker.progress_persen}%</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              { width: `${proker.progress_persen}%`, backgroundColor: progressColor },
            ]}
          />
        </View>

        {/* Meta */}
        <View style={styles.rowMeta}>
          <Text style={styles.rowJenis}>
            {proker.is_umum ? 'Proker Umum' : (proker.divisi?.nama ?? 'Divisi')}
          </Text>
          {proker.is_terlambat ? (
            <View style={styles.lateChip}>
              <AppIcon name="exclamation-triangle" size={8} color="error" />
              <Text style={styles.lateChipText}>Terlambat</Text>
            </View>
          ) : (
            <Text style={styles.rowSisa}>{proker.sisa_hari_label}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default memo(ProkerRingkasanCard);
