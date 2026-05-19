// src/components/ProkerRingkasanCard.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { getProker } from "../services/prokerApi";
import { shadow } from "../theme/theme";

const PURPLE = "#7c3aed";

export default function ProkerRingkasanCard({ onPress }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getProker();
        if (mounted) setData(res.data);
      } catch {
        // silent fail
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <View style={[styles.card, styles.loadingCard]}>
        <ActivityIndicator color={PURPLE} />
      </View>
    );
  }

  if (!data || data.statistik.total === 0) {
    return (
      <TouchableOpacity
        style={[styles.card, styles.emptyCard]}
        onPress={onPress}
        activeOpacity={0.88}
        experimental_continuousCorners={true}
      >
        <FontAwesome5 name="clipboard-list" size={24} color={PURPLE} solid />
        <View style={{ flex: 1 }}>
          <Text style={styles.emptyTitle}>Belum Ada Proker</Text>
          <Text style={styles.emptyDesc}>Program kerja akan muncul di sini.</Text>
        </View>
        <FontAwesome5 name="chevron-right" size={13} color="#C6C6C8" />
      </TouchableOpacity>
    );
  }

  const { statistik, proker } = data;
  const preview = proker.slice(0, 2);

  return (
    <View
      style={styles.card}
      experimental_continuousCorners={true}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.header}
        onPress={onPress}
        activeOpacity={0.88}
      >
        <View style={styles.headerIconBox}>
          <FontAwesome5 name="tasks" size={16} color="#fff" solid />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Program Kerja</Text>
          <Text style={styles.headerSub}>Tracking divisi & UKM</Text>
        </View>
        <View style={styles.totalBadge}>
          <Text style={styles.totalNum}>{statistik.total}</Text>
          <Text style={styles.totalLabel}>proker</Text>
        </View>
      </TouchableOpacity>

      {/* ── Stat row ───────────────────────────────────── */}
      <View style={styles.statRow}>
        <StatPill iconName="clipboard-list" label="Planning"  value={statistik.planning}  />
        <View style={styles.statSep} />
        <StatPill iconName="rocket"         label="Berjalan"  value={statistik.active}    />
        <View style={styles.statSep} />
        <StatPill iconName="check-circle"   label="Selesai"   value={statistik.completed} />
      </View>

      {statistik.terlambat > 0 && (
        <View style={styles.lateBar}>
          <FontAwesome5 name="exclamation-triangle" size={10} color="#FF3B30" solid />
          <Text style={styles.lateText}>{statistik.terlambat} proker terlambat</Text>
        </View>
      )}

      {/* ── Separator ──────────────────────────────────── */}
      <View style={styles.divider} />

      {/* ── Preview items ──────────────────────────────── */}
      <View style={styles.listWrap}>
        {preview.map((p, i) => (
          <ProkerRow
            key={p.id ?? i}
            proker={p}
            onPress={onPress}
            showSep={i < preview.length - 1}
          />
        ))}
      </View>

    </View>
  );
}

// ─── StatPill ─────────────────────────────────────────────────────────────────
function StatPill({ iconName, label, value }) {
  return (
    <View style={styles.statPill}>
      <FontAwesome5 name={iconName} size={11} color="rgba(255,255,255,0.75)" solid />
      <Text style={styles.statNum}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─── ProkerRow ────────────────────────────────────────────────────────────────
function ProkerRow({ proker, onPress, showSep }) {
  const progressColor =
    proker.warna_progress === "success" ? "#34C759" :
    proker.warna_progress === "danger"  ? "#FF3B30" :
    proker.warna_progress === "warning" ? "#FF9500" :
    PURPLE;

  return (
    <TouchableOpacity
      style={[styles.row, showSep && styles.rowSep]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Color accent */}
      <View style={[styles.rowAccent, { backgroundColor: progressColor }]} />

      <View style={styles.rowBody}>
        {/* Name + % */}
        <View style={styles.rowTop}>
          <Text style={styles.rowName} numberOfLines={1}>{proker.nama_proker}</Text>
          <Text style={[styles.rowPct, { color: progressColor }]}>
            {proker.progress_persen}%
          </Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              { width: `${proker.progress_persen}%`, backgroundColor: progressColor },
            ]}
          />
        </View>

        {/* Meta */}
        <View style={styles.rowMeta}>
          <Text style={styles.rowJenis}>
            {proker.is_umum ? "Proker Umum" : (proker.divisi?.nama ?? "Divisi")}
          </Text>
          {proker.is_terlambat ? (
            <View style={styles.lateChip}>
              <FontAwesome5 name="exclamation-triangle" size={8} color="#FF3B30" solid />
              <Text style={styles.lateChipText}>Terlambat</Text>
            </View>
          ) : (
            <Text style={styles.rowSisa}>{proker.sisa_hari_label}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.08)",
    overflow: "hidden",
    ...shadow.sm,
  },

  loadingCard: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },

  // ── Empty ──
  emptyCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
  },
  emptyTitle: { fontSize: 14, fontWeight: "600", color: "#000", marginBottom: 2 },
  emptyDesc:  { fontSize: 12, color: "#8E8E93" },

  // ── Header ──
  header: {
    backgroundColor: PURPLE,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 15, fontWeight: "700", color: "#fff" },
  headerSub:   { fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 1 },
  totalBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
  },
  totalNum:   { fontSize: 17, fontWeight: "700", color: "#fff" },
  totalLabel: { fontSize: 9, color: "rgba(255,255,255,0.75)", marginTop: 1 },

  // ── Stat row ──
  statRow: {
    flexDirection: "row",
    backgroundColor: "#6d28d9",
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 2,
    gap: 0,
  },
  statPill: { flex: 1, alignItems: "center", gap: 2, paddingVertical: 6 },
  statSep:  { width: StyleSheet.hairlineWidth, backgroundColor: "rgba(255,255,255,0.2)", marginVertical: 6 },
  statNum:  { fontSize: 16, fontWeight: "700", color: "#fff" },
  statLabel:{ fontSize: 9, color: "rgba(255,255,255,0.75)" },

  // ── Late bar ──
  lateBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,59,48,0.1)",
    marginHorizontal: 12,
    marginBottom: 2,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  lateText: { fontSize: 12, color: "#FF3B30", fontWeight: "600" },

  // ── Divider ──
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E5EA",
    marginTop: 8,
  },

  // ── List ──
  listWrap: { paddingHorizontal: 14, paddingTop: 4 },

  row: {
    flexDirection: "row",
    alignItems: "stretch",
    paddingVertical: 12,
    gap: 12,
  },
  rowSep: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  rowAccent: { width: 3, borderRadius: 2 },
  rowBody: { flex: 1, gap: 5 },

  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowName: { fontSize: 14, fontWeight: "600", color: "#000", flex: 1 },
  rowPct:  { fontSize: 13, fontWeight: "700", marginLeft: 8 },

  progressBg: {
    height: 5,
    borderRadius: 3,
    backgroundColor: "#F2F2F7",
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 3 },

  rowMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowJenis: { fontSize: 11, color: "#8E8E93" },
  rowSisa:  { fontSize: 11, color: "#8E8E93" },

  lateChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(255,59,48,0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  lateChipText: { fontSize: 10, color: "#FF3B30", fontWeight: "600" },

});
