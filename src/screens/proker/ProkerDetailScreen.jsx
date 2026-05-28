// src/screens/ProkerDetailScreen.jsx
// Detail program kerja + daftar tugas (read-only)

import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';

import { LoadingState, ErrorState } from '@shared/components';
import AppIcon from 'src/components/ui/Icon';

import { useProkerDetail, prokerKeys } from '@features/proker/hooks/useProker';

import { colors } from '@theme/colors';

import { styles } from './ProkerDetailScreen.styles';

function parseFaIconName(faClass, fallback = 'tag') {
  if (!faClass) return fallback;
  const m = faClass.match(/fa-(?:solid|regular|brands)\s+fa-([^\s]+)/);
  if (m) return m[1];
  const s = faClass.match(/^fa-([^\s]+)/);
  return s ? s[1] : fallback;
}

export default function ProkerDetailScreen({ route, navigation }) {
  const { id } = route.params;

  // ── Optimistic title dari list cache ──────────────────────────────────────
  // Kalau user sudah pernah buka ProkerListScreen, cache prokerKeys.all sudah
  // ada → ambil nama_proker secara sinkron tanpa harus tunggu detail fetch.
  const queryClient = useQueryClient();
  const optimisticTitle = queryClient
    .getQueryData(prokerKeys.all)
    ?.proker?.find((p) => p.id === id)?.nama_proker;

  // ── Server state ──────────────────────────────────────────────────────────
  const { data, isLoading, isError, error, refetch } = useProkerDetail(id);

  // ── Judul header: gunakan data detail kalau sudah ada, fallback optimistic
  useLayoutEffect(() => {
    navigation.setOptions({
      title: data?.nama_proker ?? optimisticTitle ?? 'Detail Proker',
    });
  }, [navigation, data?.nama_proker, optimisticTitle]);

  // ── Pull-to-refresh ───────────────────────────────────────────────────────
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // ── Guard states ──────────────────────────────────────────────────────────
  if (isLoading) return <LoadingState message="Memuat detail proker..." />;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;

  // ── Color logic dari status & terlambat ──────────────────────────────────
  const progressColor =
    data.progress_persen === 100
      ? colors.successIconBg // hijau — selesai
      : data.is_terlambat
        ? colors.errorAccent // merah — terlambat
        : data.progress_persen >= 50
          ? colors.amber500 // kuning — separuh jalan
          : colors.blue500; // biru — awal

  // ── Sortir tugas: yang belum selesai di atas ─────────────────────────────
  const tugasSorted = [...data.tugas].sort((a, b) => {
    if (a.is_selesai === b.is_selesai) return a.urut - b.urut;
    return a.is_selesai ? 1 : -1;
  });

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[styles.iconViolet.color]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* ── Status + Divisi ──────────────────────────────── */}
      <View style={styles.prokerMeta}>
        <View style={[styles.metaStatusBadge, { backgroundColor: progressColor + '20' }]}>
          <Text style={[styles.metaStatusText, { color: progressColor }]}>{data.label_status}</Text>
        </View>
        <View style={styles.metaDivisiRow}>
          <AppIcon
            name={data.divisi ? parseFaIconName(data.divisi.icon) : 'globe'}
            size={11}
            color="slate500"
            solid
          />
          <Text style={styles.metaDivisiText}>
            {data.divisi ? data.divisi.nama : 'Proker Umum'}
          </Text>
        </View>
      </View>

      {/* ── Progress Card ──────────────────────────────── */}
      <View style={styles.progressCard}>
        <View style={styles.progressTopRow}>
          <Text style={styles.progressLabel}>Progress Penyelesaian</Text>
          <Text style={[styles.progressBigPercent, { color: progressColor }]}>
            {data.progress_persen}%
          </Text>
        </View>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${data.progress_persen}%`,
                backgroundColor: progressColor,
              },
            ]}
          />
        </View>
        <View style={styles.progressMetaRow}>
          <Text style={styles.progressMetaText}>
            {data.tugas.filter((t) => t.is_selesai).length} dari {data.tugas.length} tugas selesai
          </Text>
          <View style={styles.progressMetaRight}>
            {data.is_terlambat ? (
              <>
                <AppIcon name="exclamation-triangle" size={10} color="errorAccent" />
                <Text style={[styles.progressMetaText, styles.textError]}>
                  Terlambat {Math.abs(data.sisa_hari)} hari
                </Text>
              </>
            ) : data.progress_persen === 100 ? (
              <>
                <AppIcon name="check-circle" size={10} color="successIconBg" />
                <Text style={[styles.progressMetaText, styles.iconSuccess]}>Selesai!</Text>
              </>
            ) : (
              <Text style={styles.progressMetaText}>{data.sisa_hari} hari lagi</Text>
            )}
          </View>
        </View>
      </View>

      {/* ── Info Cards ─────────────────────────────────── */}
      <View style={styles.infoSection}>
        {/* Tanggal */}
        <InfoCard
          iconName="calendar-alt"
          label="Periode"
          value={`${data.tanggal_mulai} — ${data.tanggal_selesai}`}
        />

        {/* PIC */}
        {data.pic && <InfoCard iconName="user" label="Penanggung Jawab" value={data.pic.name} />}

        {/* Deskripsi */}
        {data.deskripsi && (
          <View style={styles.deskripsiCard}>
            <View style={styles.deskripsiLabelRow}>
              <AppIcon name="file-alt" size={12} color="slate500" />
              <Text style={styles.deskripsiLabel}>Deskripsi</Text>
            </View>
            <Text style={styles.deskripsiText}>{data.deskripsi}</Text>
          </View>
        )}
      </View>

      {/* ── Daftar Tugas ───────────────────────────────── */}
      <View style={styles.tugasSection}>
        <View style={styles.tugasHeader}>
          <View style={styles.tugasTitleRow}>
            <AppIcon name="clipboard-list" size={13} color="slate800" />
            <Text style={styles.tugasSectionTitle}>Daftar Tugas</Text>
          </View>
          <Text style={styles.tugasSectionCount}>{data.tugas.length} tugas</Text>
        </View>

        {data.tugas.length === 0 ? (
          <View style={styles.emptyTugas}>
            <AppIcon name="inbox" size={40} color="slate400" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyTugasText}>Belum ada tugas yang dibuat</Text>
          </View>
        ) : (
          <View style={styles.tugasList}>
            {tugasSorted.map((tugas, idx) => (
              <TugasItem
                key={tugas.id ?? `tugas-${idx}`}
                tugas={tugas}
                isLast={idx === tugasSorted.length - 1}
              />
            ))}
          </View>
        )}

        {/* Read-only notice */}
        <View style={styles.readOnlyBox}>
          <AppIcon name="info-circle" size={14} color="blue600" />
          <Text style={styles.readOnlyText}>
            Status tugas hanya dapat diubah oleh admin/PIC melalui panel admin.
          </Text>
        </View>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

// ── Sub Components ──────────────────────────────────────────

function InfoCard({ iconName, label, value }) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoIconBox}>
        <AppIcon name={iconName} size={18} color="violet600" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function TugasItem({ tugas, isLast }) {
  return (
    <View style={[styles.tugasItem, isLast && { borderBottomWidth: 0 }]}>
      {/* Checkbox visual (read-only) */}
      <View style={[styles.checkbox, tugas.is_selesai && styles.checkboxSelesai]}>
        {tugas.is_selesai && <Text style={styles.checkmark}>✓</Text>}
      </View>

      <Text style={[styles.tugasNama, tugas.is_selesai && styles.tugasNamaSelesai]}>
        {tugas.nama_tugas}
      </Text>

      {tugas.is_selesai && (
        <View style={styles.selesaiBadge}>
          <Text style={styles.selesaiBadgeText}>Selesai</Text>
        </View>
      )}
    </View>
  );
}
