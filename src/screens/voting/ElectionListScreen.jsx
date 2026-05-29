// src/screens/voting/ElectionListScreen.jsx
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';

import { LoadingState, ErrorState } from '@shared/components';
import AppIcon from 'src/components/ui/Icon';

import { useElections } from '@features/voting/hooks/useVoting';

import { styles, STATUS_CONFIG, RefreshControlColor } from './ElectionListScreen.styles';

export default function ElectionListScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);

  // ── Server state ──────────────────────────────────────────────────────────
  const { data: elections, isLoading, isError, error, refetch } = useElections();

  // ── Focus refetch — supaya badge "✓ Sudah Memilih" update setelah user vote
  // dan kembali ke list, tanpa harus pull-to-refresh manual.
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // ── Pull-to-refresh ───────────────────────────────────────────────────────
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // ── Stable renderItem ─────────────────────────────────────────────────────
  const renderItem = useCallback(
    ({ item }) => {
      const cfg = item.is_tie
        ? STATUS_CONFIG.tie
        : (STATUS_CONFIG[item.status] ?? STATUS_CONFIG.draft);
      const isAktif = item.status === 'aktif';

      return (
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate('ElectionDetail', {
              id: item.id,
              judul: item.judul,
            })
          }
          activeOpacity={0.85}
        >
          {/* Garis aksen kiri */}
          <View style={[styles.accent, { backgroundColor: cfg.color }]} />

          <View style={styles.cardContent}>
            <View style={styles.cardTop}>
              <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
                <View style={[styles.badgeDot, { backgroundColor: cfg.color }]} />
                <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
              </View>
              {item.sudah_vote && (
                <View style={styles.votedBadge}>
                  <Text style={styles.votedText}>✓ Sudah Memilih</Text>
                </View>
              )}
            </View>

            <Text style={styles.posisi}>{item.posisi}</Text>
            <Text style={styles.judul}>{item.judul}</Text>

            <View style={styles.metaRow}>
              <MetaChip iconName="users" label={`${item.kandidat?.length ?? 0} Kandidat`} />
              <MetaChip iconName="vote-yea" label={`${item.total_suara} Suara`} />
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.waktuRow}>
                <AppIcon name={isAktif ? 'clock' : 'calendar-alt'} size={11} color="slate400" />
                <Text style={styles.waktu}>
                  {isAktif ? `Berakhir: ${item.waktu_selesai}` : item.waktu_mulai}
                </Text>
              </View>
              <View style={[styles.btnDetail, { backgroundColor: cfg.color }]}>
                <Text style={styles.btnDetailText}>
                  {item.sudah_vote
                    ? 'Lihat Hasil →'
                    : isAktif
                      ? 'Pilih Sekarang →'
                      : item.is_tie
                        ? 'Lihat Seri →'
                        : 'Lihat Detail →'}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [navigation]
  );

  const keyExtractor = useCallback((item) => String(item.id), []);

  // ── Guard states ──────────────────────────────────────────────────────────
  if (isLoading) return <LoadingState message="Memuat data pemilihan..." />;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>E-Voting UKM MCI</Text>
        <Text style={styles.headerSub}>Pemilihan Pengurus Periode Aktif</Text>
      </View>

      <FlatList
        data={elections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, elections.length === 0 && styles.listEmpty]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <AppIcon name="vote-yea" size={48} color="slate400" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyTitle}>Belum Ada Pemilihan</Text>
            <Text style={styles.emptySub}>Pemilihan yang aktif akan muncul di sini.</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[RefreshControlColor]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function MetaChip({ iconName, label }) {
  return (
    <View style={styles.chip}>
      <AppIcon name={iconName} size={11} color="slate500" />
      <Text style={styles.chipLabel}>{label}</Text>
    </View>
  );
}
