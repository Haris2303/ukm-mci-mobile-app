import { FontAwesome5 } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import { LoadingState, ErrorState, ScreenHeader } from '@shared/components';

import { colors, spacing, shadow } from '@theme/theme';

import RiwayatTab from './RiwayatTab';
import TransparansiTab from './TransparansiTab';
import TunggakanTab from './TunggakanTab';
import { kasKeys, useKasTunggakan, useKasRiwayat, useKasSaldo } from '../hooks/useKasQueries';

const W = Dimensions.get('window').width;
const TABS = [
  { key: 'tunggakan', label: 'Tunggakan', iconName: 'exclamation-triangle' },
  { key: 'riwayat', label: 'Riwayat', iconName: 'clipboard-list' },
  { key: 'transparansi', label: 'Transparansi', iconName: 'search' },
];
const TAB_COMPONENTS = [TunggakanTab, RiwayatTab, TransparansiTab];

export default function KasScreen() {
  const queryClient = useQueryClient();
  const scrollRef = useRef(null);
  const [activeTab, setActiveTab] = useState('tunggakan');

  const tunggakanQuery = useKasTunggakan();
  const riwayatQuery = useKasRiwayat();
  const saldoQuery = useKasSaldo();

  const isLoading = tunggakanQuery.isLoading || riwayatQuery.isLoading || saldoQuery.isLoading;
  const isError = tunggakanQuery.isError || riwayatQuery.isError || saldoQuery.isError;
  const error = tunggakanQuery.error ?? riwayatQuery.error ?? saldoQuery.error;
  const isRefreshing =
    tunggakanQuery.isRefetching || riwayatQuery.isRefetching || saldoQuery.isRefetching;

  const tunggakanCount = tunggakanQuery.data?.jumlah_tunggakan ?? 0;

  // Invalidate semua kas queries → TQ otomatis refetch observer aktif
  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: kasKeys.all });
  }, [queryClient]);

  const handleTabPress = useCallback((key) => {
    const idx = TABS.findIndex((t) => t.key === key);
    setActiveTab(key);
    scrollRef.current?.scrollTo({ x: idx * W, animated: true });
  }, []);

  const handlePageChange = useCallback((e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / W);
    if (idx >= 0 && idx < TABS.length) setActiveTab(TABS[idx].key);
  }, []);

  if (isLoading) return <LoadingState message="Memuat data keuangan..." />;
  if (isError) return <ErrorState message={error?.message} onRetry={handleRefresh} />;

  const tabData = [tunggakanQuery.data, riwayatQuery.data, saldoQuery.data];

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="E-Kas UKM MCI"
        subtitle="Sistem keuangan transparan untuk anggota"
        backgroundColor={colors.brand}
      />

      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => handleTabPress(tab.key)}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <FontAwesome5
                  name={tab.iconName}
                  size={14}
                  color={isActive ? colors.labelOnPrimary : colors.slate500}
                  solid
                />
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </View>
              {tab.key === 'tunggakan' && tunggakanCount > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{tunggakanCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handlePageChange}
        scrollEventThrottle={16}
        style={styles.content}
      >
        {TAB_COMPONENTS.map((TabComponent, idx) => (
          <ScrollView
            key={TABS[idx].key}
            style={styles.page}
            contentContainerStyle={styles.contentInner}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={[colors.brand]}
              />
            }
          >
            <TabComponent data={tabData[idx]} />
          </ScrollView>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.appBackground },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing[4],
    marginTop: -spacing[4],
    borderRadius: 16,
    padding: 5,
    gap: spacing[1],
    ...shadow.md,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: spacing[2],
    borderRadius: 12,
    alignItems: 'center',
    position: 'relative',
  },
  tabActive: { backgroundColor: colors.brand },
  tabContent: { alignItems: 'center', gap: 2 },
  tabLabel: { fontSize: 11, fontWeight: '700', color: colors.slate500 },
  tabLabelActive: { color: colors.labelOnPrimary },
  tabBadge: {
    position: 'absolute',
    top: spacing[1],
    right: spacing[1],
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.errorAccent,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  tabBadgeText: { color: colors.labelOnPrimary, fontSize: 9, fontWeight: '900' },
  content: { flex: 1 },
  page: { width: W },
  contentInner: {
    padding: spacing[5],
    paddingTop: 22,
    paddingBottom: spacing[10],
  },
});
