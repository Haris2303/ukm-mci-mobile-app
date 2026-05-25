import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useKas } from "../context/KasContext";
import { LoadingState, ErrorState, ScreenHeader } from "../../../shared/components";
import { getTunggakan, getRiwayatKas, getSaldoTransparansi } from "../api/kasApi";
import { colors, spacing, shadow } from "../../../theme/theme";
import TunggakanTab from "./TunggakanTab";
import RiwayatTab from "./RiwayatTab";
import TransparansiTab from "./TransparansiTab";

const W = Dimensions.get("window").width;
const TABS = [
  { key: "tunggakan",    label: "Tunggakan",    iconName: "exclamation-triangle" },
  { key: "riwayat",      label: "Riwayat",      iconName: "clipboard-list" },
  { key: "transparansi", label: "Transparansi", iconName: "search" },
];
const TAB_COMPONENTS = [TunggakanTab, RiwayatTab, TransparansiTab];

export default function KasScreen() {
  const { tunggakanCount, refreshRingkasan } = useKas();
  const scrollRef = useRef(null);
  const [activeTab, setActiveTab] = useState("tunggakan");
  const [tunggakan, setTunggakan] = useState(null);
  const [riwayat, setRiwayat]     = useState(null);
  const [saldo, setSaldo]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]         = useState(null);

  const fetchAll = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const [t, r, s] = await Promise.all([getTunggakan(), getRiwayatKas(), getSaldoTransparansi()]);
      setTunggakan(t.data); setRiwayat(r.data); setSaldo(s.data);
      refreshRingkasan();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false); setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleTabPress = (key) => {
    const idx = TABS.findIndex((t) => t.key === key);
    setActiveTab(key);
    scrollRef.current?.scrollTo({ x: idx * W, animated: true });
  };

  const handlePageChange = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / W);
    if (idx >= 0 && idx < TABS.length) setActiveTab(TABS[idx].key);
  };

  if (loading) return <LoadingState message="Memuat data keuangan..." />;
  if (error)   return <ErrorState message={error} onRetry={() => fetchAll()} />;

  const tabData = [tunggakan, riwayat, saldo];

  return (
    <View style={styles.container}>
      <ScreenHeader title="E-Kas UKM MCI" subtitle="Sistem keuangan transparan untuk anggota" backgroundColor={colors.brand} />

      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity key={tab.key} style={[styles.tab, isActive && styles.tabActive]} onPress={() => handleTabPress(tab.key)} activeOpacity={0.7}>
              <View style={styles.tabContent}>
                <FontAwesome5 name={tab.iconName} size={14} color={isActive ? colors.labelOnPrimary : "#64748b"} solid />
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
              </View>
              {tab.key === "tunggakan" && tunggakanCount > 0 && (
                <View style={styles.tabBadge}><Text style={styles.tabBadgeText}>{tunggakanCount}</Text></View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView ref={scrollRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={handlePageChange} scrollEventThrottle={16} style={styles.content}>
        {TAB_COMPONENTS.map((TabComponent, idx) => (
          <ScrollView key={TABS[idx].key} style={styles.page} contentContainerStyle={styles.contentInner} showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchAll(true)} colors={[colors.brand]} />}
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
    flexDirection: "row",
    backgroundColor: colors.surface,
    marginHorizontal: spacing[4],
    marginTop: -spacing[4],
    borderRadius: 16,
    padding: 5,
    gap: spacing[1],
    ...shadow.md,
  },
  tab: { flex: 1, paddingVertical: 10, paddingHorizontal: spacing[2], borderRadius: 12, alignItems: "center", position: "relative" },
  tabActive: { backgroundColor: colors.brand },
  tabContent: { alignItems: "center", gap: 2 },
  tabLabel: { fontSize: 11, fontWeight: "700", color: "#64748b" },
  tabLabelActive: { color: colors.labelOnPrimary },
  tabBadge: {
    position: "absolute", top: spacing[1], right: spacing[1], minWidth: 18, height: 18, borderRadius: 9,
    backgroundColor: colors.errorAccent, paddingHorizontal: 5, justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: colors.surface,
  },
  tabBadgeText: { color: colors.labelOnPrimary, fontSize: 9, fontWeight: "900" },
  content: { flex: 1 },
  page: { width: W },
  contentInner: { padding: spacing[5], paddingTop: 22, paddingBottom: spacing[10] },
});
