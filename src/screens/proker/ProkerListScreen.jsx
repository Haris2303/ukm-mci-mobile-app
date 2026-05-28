import React, { memo, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';

import { LoadingState, ErrorState } from '@shared/components';
import AppIcon from 'src/components/ui/Icon';

import { useProker } from '@features/proker/hooks/useProker';

import { styles, screenWidth } from './ProkerListScreen.styles';

const FILTERS = [
  { key: 'semua', label: 'Semua', iconName: 'chart-bar' },
  { key: 'planning', label: 'Planning', iconName: 'clipboard-list' },
  { key: 'active', label: 'Berjalan', iconName: 'rocket' },
  { key: 'completed', label: 'Selesai', iconName: 'check-circle' },
];

export default function ProkerListScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('semua');
  const [refreshing, setRefreshing] = useState(false);

  const pageScrollRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Program Kerja' });
  }, [navigation]);

  // ── Server state ──────────────────────────────────────────────────────────
  const { data, isLoading, isError, error, refetch } = useProker();

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

  // ── Pre-filter semua halaman sekaligus — hanya recompute saat data berubah
  const filteredPages = useMemo(
    () =>
      FILTERS.map(
        (f) => data?.proker?.filter((p) => (f.key === 'semua' ? true : p.status === f.key)) ?? []
      ),
    [data]
  );

  // ── Stable renderItem ─────────────────────────────────────────────────────
  const renderProkerCard = useCallback(
    ({ item }) => <ProkerCard proker={item} navigation={navigation} />,
    [navigation]
  );

  const keyExtractor = useCallback((item, idx) => String(item.id ?? idx), []);

  // ── Guard states ──────────────────────────────────────────────────────────
  if (isLoading) return <LoadingState message="Memuat program kerja..." />;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <View style={styles.container}>
      {/* ── Stats Banner ──────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerSub}>
          {data.statistik.total} proker · {data.statistik.active} berjalan ·{' '}
          {data.statistik.completed} selesai
        </Text>
        {data.statistik.terlambat > 0 && (
          <View style={styles.terlambatHeader}>
            <AppIcon name="exclamation-triangle" size={11} color="labelOnPrimary" />
            <Text style={styles.terlambatHeaderText}>
              {data.statistik.terlambat} proker terlambat
            </Text>
          </View>
        )}
      </View>

      {/* ── Filter Tab ─────────────────────────────────── */}
      <View style={styles.filterBar}>
        {FILTERS.map((f) => {
          const count = f.key === 'semua' ? data.statistik.total : data.statistik[f.key];
          const isActive = activeFilter === f.key;
          return (
            <FilterTab
              key={f.key}
              filter={f}
              count={count}
              isActive={isActive}
              onPress={handleFilterPress}
            />
          );
        })}
      </View>

      {/* ── List ───────────────────────────────────────── */}
      <ScrollView
        ref={pageScrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handlePageChange}
        scrollEventThrottle={16}
        style={styles.content}
      >
        {FILTERS.map((f, idx) => (
          <FlatList
            key={f.key}
            style={styles.page}
            contentContainerStyle={styles.contentInner}
            data={filteredPages[idx]}
            keyExtractor={keyExtractor}
            renderItem={renderProkerCard}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[styles.iconViolet.color]}
              />
            }
            ListEmptyComponent={<EmptyPage filter={f} />}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// ── FilterTab (memo — re-render hanya saat isActive-nya berubah) ──────────────
const FilterTab = memo(function FilterTab({ filter, count, isActive, onPress }) {
  const handlePress = useCallback(() => onPress(filter.key), [onPress, filter.key]);
  return (
    <TouchableOpacity
      style={[styles.filterTab, isActive && styles.filterTabActive]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <AppIcon name={filter.iconName} size={12} color={isActive ? 'labelOnPrimary' : 'slate500'} />
      <Text style={[styles.filterLabel, isActive && styles.filterLabelActive]}>{filter.label}</Text>
      <View style={[styles.filterBadge, isActive && styles.filterBadgeActive]}>
        <Text style={[styles.filterBadgeText, isActive && styles.filterBadgeTextActive]}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

// ── EmptyPage ─────────────────────────────────────────────────────────────────
function EmptyPage({ filter }) {
  return (
    <View style={styles.emptyState}>
      <AppIcon name="inbox" size={48} color="slate400" style={{ marginBottom: 8 }} />
      <Text style={styles.emptyTitle}>Tidak Ada Proker</Text>
      <Text style={styles.emptyDesc}>
        {filter.key === 'semua'
          ? 'Belum ada program kerja yang dapat ditampilkan.'
          : `Belum ada proker dengan status "${filter.label}".`}
      </Text>
    </View>
  );
}

function parseFaIconName(faClass, fallback = 'tag') {
  if (!faClass) return fallback;
  const m = faClass.match(/fa-(?:solid|regular|brands)\s+fa-([^\s]+)/);
  if (m) return m[1];
  const s = faClass.match(/^fa-([^\s]+)/);
  return s ? s[1] : fallback;
}

// ── ProkerCard (memo — re-render hanya saat data proker-nya berubah) ──────────
const ProkerCard = memo(function ProkerCard({ proker, navigation }) {
  const handlePress = useCallback(
    () => navigation.navigate('ProkerDetail', { id: proker.id }),
    [navigation, proker.id]
  );

  const progressColor =
    proker.warna_progress === 'success'
      ? styles.iconSuccess.color
      : proker.warna_progress === 'danger'
        ? styles.iconDanger.color
        : proker.warna_progress === 'warning'
          ? styles.iconWarning.color
          : styles.iconPrimary.color;

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.85}>
      <View style={[styles.cardAccent, { backgroundColor: progressColor }]} />

      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <View style={[styles.statusBadge, { backgroundColor: progressColor + '20' }]}>
            <Text style={[styles.statusBadgeText, { color: progressColor }]}>
              {proker.label_status}
            </Text>
          </View>
          {proker.is_terlambat && (
            <View style={styles.lateBadge}>
              <AppIcon name="exclamation-triangle" size={9} color="errorStrong" />
              <Text style={styles.lateBadgeText}>Terlambat</Text>
            </View>
          )}
        </View>

        <Text style={styles.cardTitle}>{proker.nama_proker}</Text>

        <View style={styles.cardMetaRow}>
          <View style={styles.divisiBadge}>
            <AppIcon
              name={proker.is_umum ? 'globe' : parseFaIconName(proker.divisi?.icon)}
              size={10}
              color="violet600"
              solid
            />
            <Text style={styles.divisiBadgeText}>
              {proker.is_umum ? 'Proker Umum' : (proker.divisi?.nama ?? 'Divisi')}
            </Text>
          </View>
          {proker.pic && (
            <View style={styles.picRow}>
              <AppIcon name="user" size={10} color="slate400" solid />
              <Text style={styles.picText}>{proker.pic.name}</Text>
            </View>
          )}
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${proker.progress_persen}%`, backgroundColor: progressColor },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: progressColor }]}>
            {proker.progress_persen}%
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.footerItem}>
            <AppIcon name="clipboard-list" size={10} color="slate400" />
            <Text style={styles.footerText}>
              {proker.tugas_selesai}/{proker.total_tugas} tugas
            </Text>
          </View>
          <View style={styles.footerItem}>
            <AppIcon name="calendar-alt" size={10} color="slate400" />
            <Text style={styles.footerText}>{proker.tanggal_selesai}</Text>
          </View>
          <View style={styles.footerItem}>
            <AppIcon name="clock" size={10} color="slate400" />
            <Text
              style={[
                styles.footerText,
                proker.is_terlambat && { color: styles.iconDanger.color, fontWeight: '700' },
              ]}
            >
              {proker.sisa_hari_label}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});
