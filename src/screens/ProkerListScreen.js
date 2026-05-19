// src/screens/ProkerListScreen.js
// Halaman list semua program kerja dengan filter status

import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { getProker } from "../services/prokerApi";

const FILTERS = [
  { key: "semua", label: "Semua", iconName: "chart-bar" },
  { key: "planning", label: "Planning", iconName: "clipboard-list" },
  { key: "active", label: "Berjalan", iconName: "rocket" },
  { key: "completed", label: "Selesai", iconName: "check-circle" },
];

export default function ProkerListScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [activeFilter, setActiveFilter] = useState("semua");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const res = await getProker();
      setData(res.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter list berdasarkan tab aktif
  const filteredProker =
    data?.proker?.filter((p) =>
      activeFilter === "semua" ? true : p.status === activeFilter,
    ) ?? [];

  // ── Loading ─────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Memuat program kerja...</Text>
      </View>
    );
  }

  // ── Error ──────────────────────────────────────────────
  if (error) {
    return (
      <View style={styles.center}>
        <FontAwesome5 name="frown" size={48} color="#94a3b8" style={{ marginBottom: 8 }} />
        <Text style={styles.errorTitle}>Gagal Memuat Data</Text>
        <Text style={styles.errorMsg}>{error}</Text>
        <TouchableOpacity style={styles.btnRetry} onPress={() => fetchData()}>
          <Text style={styles.btnRetryText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ── Header ────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome5 name="arrow-left" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Program Kerja</Text>
        </View>
        <Text style={styles.headerSub}>
          {data.statistik.total} proker · {data.statistik.active} berjalan ·{" "}
          {data.statistik.completed} selesai
        </Text>

        {data.statistik.terlambat > 0 && (
          <View style={styles.terlambatHeader}>
            <FontAwesome5 name="exclamation-triangle" size={11} color="#fff" solid />
            <Text style={styles.terlambatHeaderText}>
              {data.statistik.terlambat} proker terlambat
            </Text>
          </View>
        )}
      </View>

      {/* ── Filter Tab ─────────────────────────────────── */}
      <View style={styles.filterBar}>
        {FILTERS.map((f) => {
          const count =
            f.key === "semua" ? data.statistik.total : data.statistik[f.key];
          const isActive = activeFilter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterTab, isActive && styles.filterTabActive]}
              onPress={() => setActiveFilter(f.key)}
              activeOpacity={0.7}
            >
              <FontAwesome5 name={f.iconName} size={12} color={isActive ? "#fff" : "#64748b"} solid />
              <Text
                style={[
                  styles.filterLabel,
                  isActive && styles.filterLabelActive,
                ]}
              >
                {f.label}
              </Text>
              <View
                style={[
                  styles.filterBadge,
                  isActive && styles.filterBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterBadgeText,
                    isActive && styles.filterBadgeTextActive,
                  ]}
                >
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── List ───────────────────────────────────────── */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchData(true)}
            colors={["#7c3aed"]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredProker.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="inbox" size={48} color="#94a3b8" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyTitle}>Tidak Ada Proker</Text>
            <Text style={styles.emptyDesc}>
              {activeFilter === "semua"
                ? "Belum ada program kerja yang dapat ditampilkan."
                : `Belum ada proker dengan status "${FILTERS.find((f) => f.key === activeFilter)?.label}".`}
            </Text>
          </View>
        ) : (
          filteredProker.map((proker, idx) => (
            <ProkerCard
              key={proker.id ?? `proker-${idx}`}
              proker={proker}
              onPress={() =>
                navigation.navigate("ProkerDetail", { id: proker.id })
              }
            />
          ))
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════
// PROKER CARD
// ═══════════════════════════════════════════════════════════
function ProkerCard({ proker, onPress }) {
  const progressColor =
    proker.warna_progress === "success"
      ? "#22c55e"
      : proker.warna_progress === "danger"
        ? "#ef4444"
        : proker.warna_progress === "warning"
          ? "#f59e0b"
          : "#3b82f6";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.cardAccent, { backgroundColor: progressColor }]} />

      <View style={styles.cardBody}>
        {/* Header row */}
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: progressColor + "20" },
            ]}
          >
            <Text style={[styles.statusBadgeText, { color: progressColor }]}>
              {proker.label_status}
            </Text>
          </View>
          {proker.is_terlambat && (
            <View style={styles.lateBadge}>
              <FontAwesome5 name="exclamation-triangle" size={9} color="#dc2626" solid />
              <Text style={styles.lateBadgeText}>Terlambat</Text>
            </View>
          )}
        </View>

        {/* Judul */}
        <Text style={styles.cardTitle}>{proker.nama_proker}</Text>

        {/* Jenis (divisi) */}
        <View style={styles.cardMetaRow}>
          <View style={styles.divisiBadge}>
            <Text style={styles.divisiBadgeText}>{proker.jenis_label}</Text>
          </View>
          {proker.pic && (
            <View style={styles.picRow}>
              <FontAwesome5 name="user" size={10} color="#94a3b8" solid />
              <Text style={styles.picText}>{proker.pic.name}</Text>
            </View>
          )}
        </View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${proker.progress_persen}%`,
                  backgroundColor: progressColor,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: progressColor }]}>
            {proker.progress_persen}%
          </Text>
        </View>

        {/* Footer info */}
        <View style={styles.cardFooter}>
          <View style={styles.footerItem}>
            <FontAwesome5 name="clipboard-list" size={10} color="#94a3b8" solid />
            <Text style={styles.footerText}>
              {proker.tugas_selesai}/{proker.total_tugas} tugas
            </Text>
          </View>
          <View style={styles.footerItem}>
            <FontAwesome5 name="calendar-alt" size={10} color="#94a3b8" solid />
            <Text style={styles.footerText}>{proker.tanggal_selesai}</Text>
          </View>
          <View style={styles.footerItem}>
            <FontAwesome5 name="clock" size={10} color="#94a3b8" solid />
            <Text
              style={[
                styles.footerText,
                proker.is_terlambat && { color: "#ef4444", fontWeight: "700" },
              ]}
            >
              {proker.sisa_hari_label}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f3ff" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 14,
    backgroundColor: "#f5f3ff",
  },
  loadingText: { color: "#94a3b8", fontSize: 14 },

  errorTitle: { fontSize: 18, fontWeight: "800", color: "#1e293b" },
  errorMsg: { fontSize: 14, color: "#64748b", textAlign: "center" },
  btnRetry: {
    backgroundColor: "#7c3aed",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  btnRetryText: { color: "#fff", fontWeight: "700" },

  // Header
  header: {
    backgroundColor: "#7c3aed",
    paddingTop: 60,
    paddingBottom: 22,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    gap: 8,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.75)" },

  terlambatHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(239,68,68,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  terlambatHeaderText: { color: "#fff", fontSize: 11, fontWeight: "700" },

  // Filter Bar
  filterBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: -16,
    borderRadius: 16,
    padding: 5,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 5,
  },
  filterTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    gap: 2,
  },
  filterTabActive: { backgroundColor: "#7c3aed" },
  filterLabel: { fontSize: 10, fontWeight: "700", color: "#64748b" },
  filterLabelActive: { color: "#fff" },
  filterBadge: {
    minWidth: 18,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeActive: { backgroundColor: "rgba(255,255,255,0.25)" },
  filterBadgeText: { fontSize: 9, fontWeight: "800", color: "#64748b" },
  filterBadgeTextActive: { color: "#fff" },

  // Content
  content: { flex: 1 },
  contentInner: { padding: 16, paddingTop: 18, gap: 12 },

  // Card
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.08)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  cardAccent: { width: 5 },
  cardBody: { flex: 1, padding: 14, gap: 8 },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusBadgeText: { fontSize: 10, fontWeight: "800" },

  lateBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fee2e2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  lateBadgeText: { color: "#dc2626", fontSize: 9, fontWeight: "800" },

  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1e293b",
    lineHeight: 21,
  },

  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  divisiBadge: {
    backgroundColor: "#f5f3ff",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  divisiBadgeText: { fontSize: 11, color: "#7c3aed", fontWeight: "700" },
  picRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  picText: { fontSize: 11, color: "#94a3b8" },

  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#f1f5f9",
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 4 },
  progressText: {
    fontSize: 12,
    fontWeight: "900",
    minWidth: 35,
    textAlign: "right",
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E5EA",
  },
  footerItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  footerText: { fontSize: 11, color: "#64748b" },

  // Empty
  emptyState: {
    alignItems: "center",
    padding: 40,
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  emptyTitle: { fontSize: 17, fontWeight: "800", color: "#1e293b" },
  emptyDesc: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 19,
  },
});
