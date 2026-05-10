// src/components/MateriRingkasanCard.js
// Card preview materi untuk ditampilkan di HomeScreen.
// Menampilkan 2-3 materi terbaru dengan tap-to-detail.

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { getMateri } from "../services/materiApi";

export default function MateriRingkasanCard({ onPress }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getMateri();
        if (mounted) setData(res.data);
      } catch (e) {
        // diam saja - error fallback ke empty
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
      <View style={styles.skeletonCard}>
        <ActivityIndicator color="#1a4ff5" />
      </View>
    );
  }

  // ── Kosong: tampilkan card "Belum ada materi" ─────────────
  if (!data || data.total === 0) {
    return (
      <TouchableOpacity
        style={styles.emptyCard}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <Text style={styles.emptyIcon}>📚</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.emptyTitle}>Belum Ada Materi</Text>
          <Text style={styles.emptyDesc}>
            Materi pembelajaran akan muncul di sini.
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Ambil 3 materi teratas untuk preview
  const previewMateris = data.materi.slice(0, 3);

  return (
    <View style={styles.wrapper}>
      {/* ── Header ringkasan ────────────────────────── */}
      <TouchableOpacity
        style={styles.summaryCard}
        onPress={onPress}
        activeOpacity={0.92}
      >
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        <View style={styles.summaryHeader}>
          <View style={styles.summaryIconBox}>
            <Text style={styles.summaryIconText}>📚</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryLabel}>Materi Pembelajaran</Text>
            <Text style={styles.summaryHint}>Untuk Anda dan divisi Anda</Text>
          </View>
          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeNum}>{data.total}</Text>
            <Text style={styles.totalBadgeLabel}>materi</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{data.jumlah_umum}</Text>
            <Text style={styles.statLabel}>🌐 Umum</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{data.jumlah_divisi}</Text>
            <Text style={styles.statLabel}>🏆 Divisi Saya</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* ── Preview 3 materi terbaru ───────────────── */}
      <View style={styles.previewWrap}>
        <Text style={styles.previewTitle}>Terbaru</Text>
        {previewMateris.map((materi, idx) => (
          <TouchableOpacity
            key={materi.id ?? `preview-${idx}`}
            style={styles.previewItem}
            onPress={onPress}
            activeOpacity={0.85}
          >
            <View style={styles.previewIconBox}>
              <Text style={styles.previewIcon}>
                {materi.has_file ? "📄" : "🔗"}
              </Text>
            </View>
            <View style={styles.previewBody}>
              <Text style={styles.previewItemTitle} numberOfLines={1}>
                {materi.judul}
              </Text>
              <Text style={styles.previewItemMeta} numberOfLines={1}>
                {materi.jenis_label} · {materi.tanggal}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={onPress} style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>Lihat semua materi →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 10 },

  // ── Skeleton ──
  skeletonCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },

  // ── Empty ──
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

  // ── Summary card ──
  summaryCard: {
    backgroundColor: "#1a4ff5",
    borderRadius: 22,
    padding: 18,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#1a4ff5",
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
    padding: 4,
  },
  statBox: { flex: 1, alignItems: "center", paddingVertical: 8 },
  statDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.2)" },
  statNum: { color: "#fff", fontSize: 18, fontWeight: "900" },
  statLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 1,
  },

  // ── Preview list ──
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
    alignItems: "center",
    gap: 11,
    paddingVertical: 8,
  },
  previewIconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
  },
  previewIcon: { fontSize: 18 },
  previewBody: { flex: 1 },
  previewItemTitle: { fontSize: 13, fontWeight: "700", color: "#1e293b" },
  previewItemMeta: { fontSize: 11, color: "#94a3b8", marginTop: 1 },
  chevron: { color: "#cbd5e1", fontSize: 22, fontWeight: "300" },

  viewAllBtn: {
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  viewAllText: { color: "#1a4ff5", fontSize: 12, fontWeight: "700" },
});
