// src/screens/ProkerDetailScreen.js
// Detail program kerja + daftar tugas (read-only)

import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { getProkerDetail } from "../services/prokerApi";

export default function ProkerDetailScreen({ route, navigation }) {
  const { id } = route.params;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (isRefresh = false) => {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);
      try {
        const res = await getProkerDetail(id);
        setData(res.data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [id],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={styles.loadingText}>Memuat detail proker...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.center}>
        <FontAwesome5 name="frown" size={48} color="#94a3b8" style={{ marginBottom: 8 }} />
        <Text style={styles.errorTitle}>Gagal Memuat Detail</Text>
        <Text style={styles.errorMsg}>{error || "Data tidak ditemukan."}</Text>
        <TouchableOpacity style={styles.btnRetry} onPress={() => fetchData()}>
          <Text style={styles.btnRetryText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Color logic dari status & terlambat ─────────────────
  const progressColor =
    data.progress_persen === 100
      ? "#22c55e"
      : data.is_terlambat
        ? "#ef4444"
        : data.progress_persen >= 50
          ? "#f59e0b"
          : "#3b82f6";

  // ── Sortir tugas: yang belum selesai di atas ──
  const tugasSorted = [...data.tugas].sort((a, b) => {
    if (a.is_selesai === b.is_selesai) return a.urut - b.urut;
    return a.is_selesai ? 1 : -1; // belum selesai dulu
  });

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchData(true)}
          colors={["#7c3aed"]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header dengan back button ──────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="chevron-left" size={16} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View
            style={[
              styles.statusBadgeHeader,
              { backgroundColor: "rgba(255,255,255,0.2)" },
            ]}
          >
            <Text style={styles.statusBadgeHeaderText}>
              {data.label_status}
            </Text>
          </View>
          <Text style={styles.headerTitle}>{data.nama_proker}</Text>
          <View style={styles.headerDivisiRow}>
            <FontAwesome5 name="globe" size={12} color="rgba(255,255,255,0.85)" solid />
            <Text style={styles.headerDivisi}>
              {data.divisi ? data.divisi.nama : "Proker Umum"}
            </Text>
          </View>
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
            {data.tugas.filter((t) => t.is_selesai).length} dari{" "}
            {data.tugas.length} tugas selesai
          </Text>
          <View style={styles.progressMetaRight}>
            {data.is_terlambat ? (
              <>
                <FontAwesome5 name="exclamation-triangle" size={10} color="#ef4444" solid />
                <Text style={[styles.progressMetaText, { color: "#ef4444", fontWeight: "700" }]}>
                  Terlambat {Math.abs(data.sisa_hari)} hari
                </Text>
              </>
            ) : data.progress_persen === 100 ? (
              <>
                <FontAwesome5 name="check-circle" size={10} color="#22c55e" solid />
                <Text style={[styles.progressMetaText, { color: "#22c55e" }]}>Selesai!</Text>
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
        {data.pic && (
          <InfoCard iconName="user" label="Penanggung Jawab" value={data.pic.name} />
        )}

        {/* Deskripsi */}
        {data.deskripsi && (
          <View style={styles.deskripsiCard}>
            <View style={styles.deskripsiLabelRow}>
              <FontAwesome5 name="file-alt" size={12} color="#64748b" solid />
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
            <FontAwesome5 name="clipboard-list" size={13} color="#1e293b" solid />
            <Text style={styles.tugasSectionTitle}>Daftar Tugas</Text>
          </View>
          <Text style={styles.tugasSectionCount}>
            {data.tugas.length} tugas
          </Text>
        </View>

        {data.tugas.length === 0 ? (
          <View style={styles.emptyTugas}>
            <FontAwesome5 name="inbox" size={40} color="#94a3b8" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyTugasText}>
              Belum ada tugas yang dibuat
            </Text>
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
          <FontAwesome5 name="info-circle" size={14} color="#1e40af" solid />
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
        <FontAwesome5 name={iconName} size={18} color="#7c3aed" solid />
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
      <View
        style={[styles.checkbox, tugas.is_selesai && styles.checkboxSelesai]}
      >
        {tugas.is_selesai && <Text style={styles.checkmark}>✓</Text>}
      </View>

      <Text
        style={[styles.tugasNama, tugas.is_selesai && styles.tugasNamaSelesai]}
      >
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
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },

  headerContent: { flex: 1, gap: 8 },
  statusBadgeHeader: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeHeaderText: { color: "#fff", fontSize: 11, fontWeight: "800" },
  headerTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 25,
  },
  headerDivisiRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerDivisi: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
  },

  // Progress Card
  progressCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    margin: 16,
    marginTop: -14,
    padding: 18,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 6,
  },
  progressTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: { fontSize: 13, fontWeight: "700", color: "#64748b" },
  progressBigPercent: { fontSize: 26, fontWeight: "900" },
  progressBarBg: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#f1f5f9",
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 5 },
  progressMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressMetaRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  progressMetaText: { fontSize: 11, color: "#64748b" },

  // Info section
  infoSection: { paddingHorizontal: 16, gap: 10 },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f5f3ff",
    justifyContent: "center",
    alignItems: "center",
  },
  infoLabel: { fontSize: 11, color: "#94a3b8", fontWeight: "600" },
  infoValue: {
    fontSize: 13,
    color: "#1e293b",
    fontWeight: "700",
    marginTop: 2,
  },

  deskripsiCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  deskripsiLabelRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  deskripsiLabel: { fontSize: 12, fontWeight: "800", color: "#64748b" },
  deskripsiText: { fontSize: 13, color: "#475569", lineHeight: 20 },

  // Tugas section
  tugasSection: { padding: 16, paddingTop: 8 },
  tugasHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  tugasTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  tugasSectionTitle: { fontSize: 14, fontWeight: "800", color: "#1e293b" },
  tugasSectionCount: { fontSize: 11, color: "#94a3b8", fontWeight: "600" },

  tugasList: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  tugasItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelesai: {
    backgroundColor: "#22c55e",
    borderColor: "#22c55e",
  },
  checkmark: { color: "#fff", fontSize: 13, fontWeight: "900" },

  tugasNama: {
    flex: 1,
    fontSize: 13,
    color: "#1e293b",
    fontWeight: "600",
  },
  tugasNamaSelesai: {
    color: "#94a3b8",
    textDecorationLine: "line-through",
  },

  selesaiBadge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  selesaiBadgeText: { color: "#15803d", fontSize: 10, fontWeight: "800" },

  emptyTugas: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 30,
    alignItems: "center",
    gap: 8,
  },
  emptyTugasText: { fontSize: 13, color: "#94a3b8" },

  readOnlyBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    alignItems: "flex-start",
  },
  readOnlyText: { flex: 1, fontSize: 11, color: "#1e40af", lineHeight: 16 },
});
