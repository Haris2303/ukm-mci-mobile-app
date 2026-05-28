// src/screens/RiwayatScreen.jsx
import React, { useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';

import { LoadingState, ErrorState, EmptyState, ScreenHeader } from '@shared/components';
import AppIcon from 'src/components/ui/Icon';

import { useRiwayatPresensi } from '@features/presensi/hooks/usePresensi';

import { styles } from './RiwayatScreen.styles';

export default function RiwayatScreen() {
  const [refreshing, setRefreshing] = useState(false);

  // ── Server state ──────────────────────────────────────────────────────────
  const { data = [], isLoading, isError, error, refetch } = useRiwayatPresensi();

  // ── Pull-to-refresh ───────────────────────────────────────────────────────
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // ── Format tanggal ────────────────────────────────────────────────────────
  const formatTanggal = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatJam = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ── Render item riwayat ───────────────────────────────────────────────────
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.statusDotBox}>
          <View style={[styles.dot, item.status === 'Hadir' ? styles.dotHadir : styles.dotLain]} />
        </View>
        <View style={styles.timeLine} />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text style={styles.agendaName} numberOfLines={2}>
            {item.agenda?.nama_agenda ?? '–'}
          </Text>
          <View
            style={[styles.badge, item.status === 'Hadir' ? styles.badgeHadir : styles.badgeLain]}
          >
            <Text
              style={[
                styles.badgeText,
                item.status === 'Hadir' ? styles.badgeTextHadir : styles.badgeTextLain,
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <AppIcon name="map-marker-alt" size={12} color="slate400" />
          <Text style={styles.metaText}>{item.agenda?.lokasi ?? 'Lokasi tidak tersedia'}</Text>
        </View>

        <View style={styles.metaRow}>
          <AppIcon name="clock" size={12} color="slate400" />
          <Text style={styles.metaText}>Hadir pukul {formatJam(item.jam_hadir)}</Text>
        </View>

        <View style={styles.metaRow}>
          <AppIcon name="calendar-alt" size={12} color="slate400" />
          <Text style={styles.metaText}>{formatTanggal(item.jam_hadir)}</Text>
        </View>
      </View>
    </View>
  );

  // ── Guard states ──────────────────────────────────────────────────────────
  if (isLoading) return <LoadingState message="Memuat riwayat..." />;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;

  // ── Render: List ──────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Riwayat Presensi"
        subtitle={`${data.length} kehadiran tercatat`}
        backgroundColor={styles.primary.color}
      />

      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyState
            iconName="inbox"
            title="Belum Ada Riwayat"
            description="Riwayat presensi Anda akan muncul di sini setelah Anda berhasil scan QR Code."
          />
        }
        contentContainerStyle={[styles.listContent, data.length === 0 && styles.listContentEmpty]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[styles.primary.color]}
            tintColor={styles.primary.color}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
