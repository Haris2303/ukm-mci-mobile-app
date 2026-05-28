// src/screens/MateriScreen.jsx
// Halaman lengkap distribusi materi dengan filter, download, dan cache offline

import { FontAwesome5 } from '@expo/vector-icons';
import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';

import openExternalLink from '@core/utils/openExternalLink';
import parseFaIconName from '@core/utils/parseFaIcon';

import { LoadingState, ErrorState } from '@shared/components';

import { useMateri } from '@features/materi/hooks/useMateri';
import { downloadAndOpen } from '@features/materi/services/materiDownloader';

import { colors } from '@theme/colors';

import { styles, screenWidth, MATERI_ACCENT } from './MateriScreen.styles';

const FILTERS = [
  { key: 'semua', label: 'Semua', iconName: 'book' },
  { key: 'umum', label: 'Umum', iconName: 'globe' },
  { key: 'divisi', label: 'Divisi Saya', iconName: 'users' },
];

export default function MateriScreen() {
  const [activeFilter, setActiveFilter] = useState('semua');
  const [downloadingId, setDownloadingId] = useState(null);
  // RefreshControl butuh boolean tersendiri — tidak bisa pakai isRefetching
  // langsung karena RN mengharapkan state yang kita kendalikan sendiri.
  const [refreshing, setRefreshing] = useState(false);

  const pageScrollRef = useRef(null);

  // ── Server state (React Query) ────────────────────────────────────────────
  const { data, isLoading, isError, error, refetch } = useMateri();

  // ── Pull-to-refresh ───────────────────────────────────────────────────────
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // ── Filter / page navigation ──────────────────────────────────────────────
  const handleFilterPress = useCallback((key) => {
    const idx = FILTERS.findIndex((f) => f.key === key);
    setActiveFilter(key);
    pageScrollRef.current?.scrollTo({ x: idx * screenWidth, animated: true });
  }, []);

  const handlePageChange = useCallback((e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
    if (idx >= 0 && idx < FILTERS.length) setActiveFilter(FILTERS[idx].key);
  }, []);

  // ── Download — TETAP local state (UI state, bukan server state) ──────────
  const handleDownloadDanBuka = useCallback(async (materi) => {
    setDownloadingId(materi.id);
    try {
      await downloadAndOpen(materi);
    } catch (e) {
      Alert.alert('❌ Gagal Mengunduh', e.message);
    } finally {
      setDownloadingId(null);
    }
  }, []);

  const handleBukaLink = useCallback(async (url) => {
    try {
      await openExternalLink(url);
    } catch (e) {
      Alert.alert('❌ Tidak Bisa Membuka', e.message);
    }
  }, []);

  // ── Guard states ──────────────────────────────────────────────────────────
  if (isLoading) return <LoadingState message="Memuat materi..." />;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <View style={styles.container}>
      {/* ── Stats Strip ──────────────────────────────── */}
      <View style={styles.statsStrip}>
        <Text style={styles.statsText}>
          {data.total} materi tersedia · {data.jumlah_umum} umum + {data.jumlah_divisi} divisi
        </Text>
      </View>

      {/* ── Filter Bar ───────────────────────────────── */}
      <View style={styles.filterBar}>
        {FILTERS.map((f) => {
          const count =
            f.key === 'semua'
              ? data.total
              : f.key === 'umum'
                ? data.jumlah_umum
                : data.jumlah_divisi;
          const isActive = activeFilter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterTab, isActive && styles.filterTabActive]}
              onPress={() => handleFilterPress(f.key)}
              activeOpacity={0.7}
            >
              <FontAwesome5
                name={f.iconName}
                size={12}
                color={isActive ? colors.labelOnPrimary : colors.slate500}
                solid
              />
              <Text style={[styles.filterLabel, isActive && styles.filterLabelActive]}>
                {f.label}
              </Text>
              <View style={[styles.filterBadge, isActive && styles.filterBadgeActive]}>
                <Text style={[styles.filterBadgeText, isActive && styles.filterBadgeTextActive]}>
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Content ──────────────────────────────────── */}
      <ScrollView
        ref={pageScrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handlePageChange}
        scrollEventThrottle={16}
        style={styles.content}
      >
        {FILTERS.map((f) => {
          const pageMateri =
            data?.materi?.filter((m) => {
              if (f.key === 'semua') return true;
              if (f.key === 'umum') return m.is_umum;
              if (f.key === 'divisi') return !m.is_umum;
              return true;
            }) ?? [];

          return (
            <ScrollView
              key={f.key}
              style={styles.page}
              contentContainerStyle={styles.contentInner}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[colors.brand]}
                />
              }
              showsVerticalScrollIndicator={false}
            >
              {pageMateri.length === 0 ? (
                <View style={styles.emptyState}>
                  <FontAwesome5
                    name="inbox"
                    size={48}
                    color={colors.slate400}
                    style={{ marginBottom: 8 }}
                  />
                  <Text style={styles.emptyTitle}>Tidak Ada Materi</Text>
                  <Text style={styles.emptyDesc}>
                    {f.key === 'umum'
                      ? 'Belum ada materi umum yang dipublikasikan.'
                      : f.key === 'divisi'
                        ? 'Belum ada materi khusus untuk divisi Anda.'
                        : 'Belum ada materi tersedia. Pantau terus halaman ini.'}
                  </Text>
                </View>
              ) : (
                pageMateri.map((materi, mIdx) => (
                  <MateriCard
                    key={materi.id ?? `materi-${mIdx}`}
                    materi={materi}
                    isDownloading={downloadingId === materi.id}
                    onDownload={() => handleDownloadDanBuka(materi)}
                    onOpenLink={() => handleBukaLink(materi.link_url)}
                  />
                ))
              )}
              <View style={{ height: 30 }} />
            </ScrollView>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════
// MATERI CARD
// ═══════════════════════════════════════════════════════════
function MateriCard({ materi, isDownloading, onDownload, onOpenLink }) {
  const accentColor = materi.is_umum ? MATERI_ACCENT.umum : MATERI_ACCENT.divisi;

  return (
    <View style={styles.card}>
      <View style={[styles.cardAccent, { backgroundColor: accentColor }]} />

      <View style={styles.cardBody}>
        <View style={[styles.jenisBadge, { backgroundColor: accentColor + '15' }]}>
          <FontAwesome5
            name={materi.is_umum ? 'globe' : parseFaIconName(materi.divisi?.icon)}
            size={10}
            color={accentColor}
            solid
          />
          <Text style={[styles.jenisBadgeText, { color: accentColor }]}>
            {materi.is_umum ? 'Umum' : (materi.divisi?.nama ?? 'Divisi')}
          </Text>
        </View>

        <Text style={styles.cardTitle}>{materi.judul}</Text>

        {materi.deskripsi && (
          <Text style={styles.cardDesc} numberOfLines={3}>
            {materi.deskripsi}
          </Text>
        )}

        <View style={styles.metaRow}>
          <FontAwesome5 name="user" size={11} color={colors.slate400} solid />
          <Text style={styles.metaText}>{materi.uploader}</Text>
          <Text style={styles.metaDot}>·</Text>
          <FontAwesome5 name="calendar-alt" size={11} color={colors.slate400} solid />
          <Text style={styles.metaText}>{materi.tanggal}</Text>
        </View>

        <View style={styles.actionsRow}>
          {materi.has_file && (
            <TouchableOpacity
              style={[styles.btnPrimary, isDownloading && styles.btnDisabled]}
              onPress={onDownload}
              disabled={isDownloading}
              activeOpacity={0.85}
            >
              {isDownloading ? (
                <>
                  <ActivityIndicator color={colors.labelOnPrimary} size="small" />
                  <Text style={styles.btnPrimaryText}>Mengunduh...</Text>
                </>
              ) : (
                <>
                  <FontAwesome5 name="download" size={13} color={colors.labelOnPrimary} solid />
                  <Text style={styles.btnPrimaryText}>
                    Buka PDF{materi.file_size ? ` · ${materi.file_size}` : ''}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {materi.has_link && (
            <TouchableOpacity style={styles.btnSecondary} onPress={onOpenLink} activeOpacity={0.85}>
              <FontAwesome5 name="link" size={13} color={colors.brand} solid />
              <Text style={styles.btnSecondaryText}>Link</Text>
            </TouchableOpacity>
          )}
        </View>

        {!materi.has_file && !materi.has_link && (
          <View style={styles.noContentBox}>
            <View style={styles.noContentRow}>
              <FontAwesome5 name="info-circle" size={12} color={colors.slate400} solid />
              <Text style={styles.noContentText}>Materi ini belum memiliki file atau link</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
