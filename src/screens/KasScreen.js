// src/screens/KasScreen.js
// Halaman lengkap E-Kas dengan 3 tab:
//   1. Tunggakan (tagihan belum dibayar)
//   2. Riwayat (pembayaran lunas)
//   3. Transparansi (saldo organisasi)

import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useKas } from "../context/KasContext";
import {
  getTunggakan,
  getRiwayatKas,
  getSaldoTransparansi,
} from "../services/kasApi";

const TABS = [
  { key: "tunggakan", label: "Tunggakan", iconName: "exclamation-triangle" },
  { key: "riwayat", label: "Riwayat", iconName: "clipboard-list" },
  { key: "transparansi", label: "Transparansi", iconName: "search" },
];

export default function KasScreen() {
  const { tunggakanCount, refreshRingkasan } = useKas();

  const [activeTab, setActiveTab] = useState("tunggakan");
  const [tunggakan, setTunggakan] = useState(null);
  const [riwayat, setRiwayat] = useState(null);
  const [saldo, setSaldo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const [t, r, s] = await Promise.all([
        getTunggakan(),
        getRiwayatKas(),
        getSaldoTransparansi(),
      ]);
      setTunggakan(t.data);
      setRiwayat(r.data);
      setSaldo(s.data);
      // Update context juga
      refreshRingkasan();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a4ff5" />
        <Text style={styles.loadingText}>Memuat data keuangan...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>😕</Text>
        <Text style={styles.errorTitle}>Gagal Memuat Data</Text>
        <Text style={styles.errorMsg}>{error}</Text>
        <TouchableOpacity style={styles.btnRetry} onPress={() => fetchAll()}>
          <Text style={styles.btnRetryText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ── HEADER ─────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>E-Kas UKM MCI</Text>
        <Text style={styles.headerSub}>
          Sistem keuangan transparan untuk anggota
        </Text>
      </View>

      {/* ── TAB BAR ─────────────────────────────────────── */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const showBadge = tab.key === "tunggakan" && tunggakanCount > 0;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <FontAwesome5
                  name={tab.iconName}
                  size={14}
                  color={isActive ? "#fff" : "#64748b"}
                  solid
                />
                <Text
                  style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                >
                  {tab.label}
                </Text>
              </View>
              {showBadge && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{tunggakanCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── CONTENT ─────────────────────────────────────── */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchAll(true)}
            colors={["#1a4ff5"]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "tunggakan" && <TunggakanTab data={tunggakan} />}
        {activeTab === "riwayat" && <RiwayatTab data={riwayat} />}
        {activeTab === "transparansi" && <TransparansiTab data={saldo} />}
      </ScrollView>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB: TUNGGAKAN (tagihan belum dibayar)
// ═══════════════════════════════════════════════════════════
function TunggakanTab({ data }) {
  if (!data || data.jumlah_tunggakan === 0) {
    return (
      <EmptyState
        iconName="check-circle"
        title="Tidak Ada Tunggakan!"
        desc="Selamat! Semua iuran Anda telah lunas. Terima kasih atas ketertiban Anda dalam membayar iuran."
        bgColor="#f0fdf4"
        accentColor="#22c55e"
      />
    );
  }

  return (
    <View style={{ gap: 14 }}>
      {/* Total summary card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryIconBox}>
          <FontAwesome5 name="chart-bar" size={24} color="#92400e" solid />
        </View>
        <View style={styles.summaryContent}>
          <Text style={styles.summaryLabel}>Total Tunggakan Anda</Text>
          <Text style={styles.summaryValue}>{data.total_format}</Text>
          <Text style={styles.summaryMeta}>
            {data.jumlah_tunggakan} bulan belum dibayar
          </Text>
        </View>
      </View>

      {/* Info instruksi */}
      <View style={styles.infoBox}>
        <FontAwesome5 name="lightbulb" size={16} color="#1e40af" solid />
        <Text style={styles.infoText}>
          Hubungi <Text style={{ fontWeight: "700" }}>Bendahara UKM</Text> untuk
          melakukan pembayaran tunai. Status akan otomatis update setelah
          bendahara mencatat pembayaran Anda.
        </Text>
      </View>

      {/* Daftar tagihan */}
      <Text style={styles.sectionLabel}>Daftar Tagihan</Text>
      {data.tagihan.map((item, idx) => (
        <View key={item.id ?? `tagihan-${idx}`} style={styles.itemCard}>
          <View style={styles.itemAccent} />
          <View style={styles.itemBody}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemPeriode}>
                {item.bulan_tagihan_format}
              </Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>Belum Dibayar</Text>
              </View>
            </View>
            <Text style={styles.itemNominal}>{item.nominal_format}</Text>
            {item.catatan && (
              <View style={styles.catatanRow}>
                <FontAwesome5 name="comment-alt" size={11} color="#64748b" solid />
                <Text style={styles.itemCatatan} numberOfLines={2}>
                  {item.catatan}
                </Text>
              </View>
            )}
            <View style={styles.metaRow}>
              <FontAwesome5 name="calendar-alt" size={11} color="#94a3b8" solid />
              <Text style={styles.itemMeta}>Ditagihkan: {item.dibuat_pada}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB: RIWAYAT (pembayaran lunas)
// ═══════════════════════════════════════════════════════════
function RiwayatTab({ data }) {
  if (!data || data.jumlah_pembayaran === 0) {
    return (
      <EmptyState
        iconName="inbox"
        title="Belum Ada Riwayat"
        desc="Riwayat pembayaran Anda akan muncul di sini setelah Bendahara mencatat pembayaran iuran."
        bgColor="#f8fafc"
        accentColor="#94a3b8"
      />
    );
  }

  return (
    <View style={{ gap: 14 }}>
      {/* Total summary card */}
      <View style={[styles.summaryCard, styles.summaryCardSuccess]}>
        <View style={[styles.summaryIconBox, styles.summaryIconBoxSuccess]}>
          <FontAwesome5 name="check-circle" size={24} color="#fff" solid />
        </View>
        <View style={styles.summaryContent}>
          <Text style={styles.summaryLabel}>Total Sudah Dibayar</Text>
          <Text style={[styles.summaryValue, { color: "#15803d" }]}>
            {data.total_dibayar_format}
          </Text>
          <Text style={styles.summaryMeta}>
            {data.jumlah_pembayaran} kali pembayaran
          </Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Riwayat Pembayaran</Text>

      {/* Timeline-style list */}
      {data.riwayat.map((item, idx) => (
        <View key={item.id ?? `riwayat-${idx}`} style={styles.timelineItem}>
          {/* Timeline indicator */}
          <View style={styles.timelineLeft}>
            <View style={styles.timelineDot}>
              <Text style={styles.timelineDotIcon}>✓</Text>
            </View>
            {idx < data.riwayat.length - 1 && (
              <View style={styles.timelineLine} />
            )}
          </View>

          {/* Card */}
          <View style={styles.timelineCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemPeriode}>
                {item.bulan_tagihan_format}
              </Text>
              <View style={styles.statusBadgeLunas}>
                <Text style={styles.statusBadgeLunasText}>✓ Lunas</Text>
              </View>
            </View>
            <Text style={[styles.itemNominal, { color: "#15803d" }]}>
              {item.nominal_format}
            </Text>
            <View style={styles.metaRow}>
              <FontAwesome5 name="clock" size={11} color="#94a3b8" solid />
              <Text style={styles.itemMeta}>Dibayar: {item.tanggal_bayar_format} WIT</Text>
            </View>
            {item.catatan && (
              <View style={styles.catatanRow}>
                <FontAwesome5 name="comment-alt" size={11} color="#64748b" solid />
                <Text style={styles.itemCatatan} numberOfLines={2}>
                  {item.catatan}
                </Text>
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB: TRANSPARANSI (saldo organisasi)
// ═══════════════════════════════════════════════════════════
function TransparansiTab({ data }) {
  if (!data) return null;

  const isPositif = data.total_saldo >= 0;

  return (
    <View style={{ gap: 14 }}>
      {/* Saldo besar */}
      <View
        style={[styles.bigSaldo, !isPositif && { backgroundColor: "#dc2626" }]}
      >
        <View style={styles.circle1Big} />
        <View style={styles.circle2Big} />

        <View style={styles.bigSaldoLabelRow}>
          <FontAwesome5 name="coins" size={13} color="rgba(255,255,255,0.85)" solid />
          <Text style={styles.bigSaldoLabel}>Saldo Kas Organisasi</Text>
        </View>
        <Text style={styles.bigSaldoValue}>{data.total_saldo_format}</Text>
        <View style={styles.bigSaldoMetaRow}>
          <FontAwesome5 name="clock" size={11} color="rgba(255,255,255,0.7)" solid />
          <Text style={styles.bigSaldoMeta}>Diperbarui: {data.diperbarui_pada}</Text>
        </View>
      </View>

      {/* Rincian breakdown */}
      <Text style={styles.sectionLabel}>Rincian Saldo</Text>

      <View style={styles.breakdownCard}>
        <BreakdownRow
          iconName="users"
          color="#3b82f6"
          label="Iuran Anggota Lunas"
          value={data.rincian.iuran_lunas.format}
          isPositive
        />
        <View style={styles.divider} />
        <BreakdownRow
          iconName="gift"
          color="#10b981"
          label="Donasi & Bantuan"
          value={data.rincian.kas_masuk.format}
          isPositive
        />
        <View style={styles.divider} />
        <BreakdownRow
          iconName="shopping-cart"
          color="#ef4444"
          label="Pengeluaran"
          value={data.rincian.kas_keluar.format}
          isPositive={false}
        />
        <View
          style={[styles.divider, { backgroundColor: "#1a4ff5", height: 2 }]}
        />
        <BreakdownRow
          iconName="gem"
          color="#1a4ff5"
          label="Saldo Akhir"
          value={data.total_saldo_format}
          isTotal
          isPositive={isPositif}
        />
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimerBox}>
        <FontAwesome5 name="info-circle" size={16} color="#64748b" solid />
        <Text style={styles.disclaimerText}>
          Data ini diperbarui secara real-time dari pencatatan Bendahara. Jika
          menemukan ketidaksesuaian, harap hubungi pengurus segera.
        </Text>
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════

function EmptyState({ iconName, title, desc, bgColor, accentColor }) {
  return (
    <View
      style={[
        styles.emptyState,
        { backgroundColor: bgColor, borderColor: accentColor + "40" },
      ]}
    >
      <View style={[styles.emptyIconBox, { backgroundColor: accentColor + "20" }]}>
        <FontAwesome5 name={iconName} size={32} color={accentColor} solid />
      </View>
      <Text style={[styles.emptyTitle, { color: accentColor }]}>{title}</Text>
      <Text style={styles.emptyDesc}>{desc}</Text>
    </View>
  );
}

function BreakdownRow({
  iconName,
  color,
  label,
  value,
  isPositive = true,
  isTotal = false,
}) {
  return (
    <View style={styles.breakdownRow}>
      <View
        style={[styles.breakdownIconBox, { backgroundColor: color + "15" }]}
      >
        <FontAwesome5 name={iconName} size={16} color={color} solid />
      </View>
      <View style={styles.breakdownLabelBox}>
        <Text
          style={[
            styles.breakdownLabel,
            isTotal && { fontWeight: "800", color: "#1e293b" },
          ]}
        >
          {label}
        </Text>
        {!isTotal && (
          <Text style={styles.breakdownSign}>
            {isPositive ? "+ Pemasukan" : "− Pengeluaran"}
          </Text>
        )}
      </View>
      <Text
        style={[
          styles.breakdownValue,
          { color: isTotal ? "#1a4ff5" : isPositive ? "#15803d" : "#dc2626" },
          isTotal && { fontSize: 17, fontWeight: "900" },
        ]}
      >
        {!isTotal && (isPositive ? "+ " : "− ")}
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4ff" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
    padding: 32,
    backgroundColor: "#f0f4ff",
  },
  loadingText: { color: "#94a3b8", fontSize: 14 },

  // ── Error ──
  errorIcon: { fontSize: 48 },
  errorTitle: { fontSize: 18, fontWeight: "800", color: "#1e293b" },
  errorMsg: { fontSize: 14, color: "#64748b", textAlign: "center" },
  btnRetry: {
    backgroundColor: "#1a4ff5",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  btnRetryText: { color: "#fff", fontWeight: "700" },

  // ── Header ──
  header: {
    backgroundColor: "#1a4ff5",
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.75)" },

  // ── Tab Bar ──
  tabBar: {
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
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: "center",
    position: "relative",
  },
  tabActive: { backgroundColor: "#1a4ff5" },
  tabContent: { alignItems: "center", gap: 2 },
  tabIcon: { fontSize: 16 },
  tabLabel: { fontSize: 11, fontWeight: "700", color: "#64748b" },
  tabLabelActive: { color: "#fff" },

  tabBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ef4444",
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  tabBadgeText: { color: "#fff", fontSize: 9, fontWeight: "900" },

  // ── Content ──
  content: { flex: 1 },
  contentInner: { padding: 20, paddingTop: 22, paddingBottom: 40 },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#64748b",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginTop: 6,
    marginBottom: 2,
  },

  // ── Summary Card ──
  summaryCard: {
    backgroundColor: "#fef3c7",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#fcd34d",
  },
  summaryCardSuccess: { backgroundColor: "#f0fdf4", borderColor: "#86efac" },
  summaryIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#fbbf24",
    justifyContent: "center",
    alignItems: "center",
  },
  summaryIconBoxSuccess: { backgroundColor: "#22c55e" },
  summaryIcon: { fontSize: 26 },
  summaryContent: { flex: 1 },
  summaryLabel: { fontSize: 12, color: "#92400e", fontWeight: "600" },
  summaryValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#92400e",
    marginTop: 2,
  },
  summaryMeta: { fontSize: 11, color: "#a16207", marginTop: 2 },

  // ── Info Box ──
  infoBox: {
    backgroundColor: "#eff6ff",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    gap: 10,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  infoIcon: { fontSize: 18 },
  infoText: { flex: 1, fontSize: 12, color: "#1e40af", lineHeight: 18 },

  // ── Item Card (tagihan) ──
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemAccent: { width: 4, backgroundColor: "#fbbf24" },
  itemBody: { flex: 1, padding: 14, gap: 6 },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemPeriode: { fontSize: 14, fontWeight: "800", color: "#1e293b" },
  itemNominal: { fontSize: 18, fontWeight: "900", color: "#92400e" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  catatanRow: { flexDirection: "row", alignItems: "flex-start", gap: 5 },
  itemCatatan: { flex: 1, fontSize: 12, color: "#64748b", fontStyle: "italic" },
  itemMeta: { fontSize: 11, color: "#94a3b8" },

  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: "#fef3c7",
  },
  statusBadgeText: { fontSize: 10, fontWeight: "800", color: "#92400e" },

  statusBadgeLunas: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: "#dcfce7",
  },
  statusBadgeLunasText: { fontSize: 10, fontWeight: "800", color: "#15803d" },

  // ── Timeline (riwayat) ──
  timelineItem: { flexDirection: "row", gap: 12 },
  timelineLeft: { alignItems: "center", width: 26 },
  timelineDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#dcfce7",
  },
  timelineDotIcon: { color: "#fff", fontSize: 12, fontWeight: "900" },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: "#e2e8f0",
    marginTop: 4,
    marginBottom: -14,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    gap: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 8,
  },

  // ── Big Saldo (transparansi) ──
  bigSaldo: {
    backgroundColor: "#1a4ff5",
    borderRadius: 24,
    padding: 26,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#1a4ff5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  circle1Big: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  circle2Big: {
    position: "absolute",
    bottom: -40,
    left: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(15,244,198,0.1)",
  },
  bigSaldoLabelRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  bigSaldoLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "700",
  },
  bigSaldoMetaRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  bigSaldoValue: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: -1,
    marginBottom: 8,
  },
  bigSaldoMeta: { color: "rgba(255,255,255,0.7)", fontSize: 12 },

  // ── Breakdown Card ──
  breakdownCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
  },
  breakdownIconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  breakdownIcon: { fontSize: 18 },
  breakdownLabelBox: { flex: 1 },
  breakdownLabel: { fontSize: 13, fontWeight: "700", color: "#475569" },
  breakdownSign: { fontSize: 10, color: "#94a3b8", marginTop: 1 },
  breakdownValue: { fontSize: 14, fontWeight: "800" },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginHorizontal: 12 },

  // ── Disclaimer ──
  disclaimerBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    gap: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  disclaimerIcon: { fontSize: 18 },
  disclaimerText: { flex: 1, fontSize: 11, color: "#64748b", lineHeight: 17 },

  // ── Empty State ──
  emptyState: {
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  emptyIconBox: { width: 72, height: 72, borderRadius: 36, justifyContent: "center", alignItems: "center" },
  emptyTitle: { fontSize: 18, fontWeight: "800" },
  emptyDesc: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 19,
  },
});
