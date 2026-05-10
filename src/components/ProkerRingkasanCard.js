// src/components/ProkerRingkasanCard.js
// Card preview program kerja untuk HomeScreen.
// Tampilkan ringkasan: total + breakdown status + 2 proker terbaru

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getProker } from "../services/prokerApi";

export default function ProkerRingkasanCard({ onPress }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getProker();
        if (mounted) setData(res.data);
      } catch (e) {
        // silent fail — fallback ke empty state
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ── Loading skeleton ─────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.skeleton}>
        <ActivityIndicator color="#1a4ff5" />
      </View>
    );
  }

  // ── Empty state ─────────────────────────────────────────
  if (!data || data.statistik.total === 0) {
    return (
      <TouchableOpacity
        style={styles.emptyCard}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <Text style={styles.emptyIcon}>📊</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.emptyTitle}>Belum Ada Proker</Text>
          <Text style={styles.emptyDesc}>
            Program kerja akan muncul di sini.
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  const { statistik, proker } = data;
  const previewProker = proker.slice(0, 2);

  return (
    <View style={styles.wrapper}>
      {/* ── Header summary card ────────────────────── */}
      <TouchableOpacity
        style={styles.summaryCard}
        onPress={onPress}
        activeOpacity={0.92}
      >
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        <View style={styles.summaryHeader}>
          <View style={styles.summaryIconBox}>
            <Text style={styles.summaryIconText}>📊</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryLabel}>Program Kerja</Text>
            <Text style={styles.summaryHint}>Tracking divisi & UKM</Text>
          </View>
          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeNum}>{statistik.total}</Text>
            <Text style={styles.totalBadgeLabel}>proker</Text>
          </View>
        </View>

        {/* Stats grid */}
        <View style={styles.statsRow}>
          <StatBox emoji="📋" label="Planning" value={statistik.planning} />
          <View style={styles.statDivider} />
          <StatBox emoji="🚀" label="Berjalan" value={statistik.active} />
          <View style={styles.statDivider} />
          <StatBox emoji="✅" label="Selesai" value={statistik.completed} />
        </View>

        {/* Alert terlambat */}
        {statistik.terlambat > 0 && (
          <View style={styles.terlambatBox}>
            <Text style={styles.terlambatText}>
              ⚠️ {statistik.terlambat} proker terlambat
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* ── Preview 2 proker terbaru ───────────────── */}
      <View style={styles.previewWrap}>
        <Text style={styles.previewTitle}>Terbaru</Text>
        {previewProker.map((p, idx) => (
          <ProkerPreviewItem key={p.id ?? `proker-preview-${idx}`} proker={p} onPress={onPress} />
        ))}
        <TouchableOpacity onPress={onPress} style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>Lihat semua proker →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── StatBox ──────────────────────────────────────────────
function StatBox({ emoji, label, value }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statNum}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ── Preview Item ─────────────────────────────────────────
function ProkerPreviewItem({ proker, onPress }) {
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
      style={styles.previewItem}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View
        style={[styles.previewAccent, { backgroundColor: progressColor }]}
      />
      <View style={styles.previewBody}>
        <Text style={styles.previewName} numberOfLines={1}>
          {proker.nama_proker}
        </Text>
        <Text style={styles.previewMeta} numberOfLines={1}>
          {proker.jenis_label}
        </Text>

        {/* Mini progress bar */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${proker.progress_persen}%`,
                backgroundColor: progressColor,
              },
            ]}
          />
        </View>

        <View style={styles.progressMeta}>
          <Text style={[styles.progressPercent, { color: progressColor }]}>
            {proker.progress_persen}%
          </Text>
          <Text style={styles.previewSisa}>
            {proker.is_terlambat ? "⚠️ Terlambat" : `${proker.sisa_hari_label}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 10 },

  skeleton: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },

  // Empty
  emptyCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#f8fafc",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#e2e8f0",
  },
  emptyIcon: { fontSize: 36 },
  emptyTitle: { fontSize: 14, fontWeight: "800", color: "#475569" },
  emptyDesc: { fontSize: 11, color: "#94a3b8", marginTop: 2 },

  // Summary card
  summaryCard: {
    backgroundColor: "#7c3aed",
    borderRadius: 22,
    padding: 18,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 6,
    gap: 14,
  },
  circle1: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  circle2: {
    position: "absolute",
    bottom: -25,
    left: -25,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(15,244,198,0.1)",
  },
  summaryHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  summaryIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  summaryIconText: { fontSize: 22 },
  summaryLabel: { color: "#fff", fontSize: 14, fontWeight: "800" },
  summaryHint: { color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 1 },

  totalBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    alignItems: "center",
  },
  totalBadgeNum: { color: "#fff", fontSize: 18, fontWeight: "900" },
  totalBadgeLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 9,
    fontWeight: "600",
  },

  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    padding: 6,
  },
  statBox: { flex: 1, alignItems: "center", paddingVertical: 6, gap: 2 },
  statDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.2)" },
  statEmoji: { fontSize: 16 },
  statNum: { color: "#fff", fontSize: 16, fontWeight: "900" },
  statLabel: { color: "rgba(255,255,255,0.8)", fontSize: 9, fontWeight: "600" },

  terlambatBox: {
    backgroundColor: "rgba(239,68,68,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  terlambatText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },

  // Preview list
  previewWrap: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  previewTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  previewItem: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 6,
  },
  previewAccent: { width: 4, borderRadius: 2 },
  previewBody: { flex: 1, gap: 4 },
  previewName: { fontSize: 13, fontWeight: "700", color: "#1e293b" },
  previewMeta: { fontSize: 11, color: "#94a3b8" },

  progressBar: {
    height: 5,
    borderRadius: 3,
    backgroundColor: "#f1f5f9",
    overflow: "hidden",
    marginTop: 4,
  },
  progressFill: { height: "100%", borderRadius: 3 },

  progressMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressPercent: { fontSize: 11, fontWeight: "800" },
  previewSisa: { fontSize: 10, color: "#94a3b8" },

  viewAllBtn: {
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  viewAllText: { color: "#7c3aed", fontSize: 12, fontWeight: "700" },
});
