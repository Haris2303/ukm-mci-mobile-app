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
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { getMateri } from "../services/materiApi";
import { colors, fontFamily, spacing } from "../theme/theme";

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
        // silent fail — fallback ke empty state
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // ── Loading skeleton ─────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.skeletonCard}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  // ── Kosong ───────────────────────────────────────────────
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
            <FontAwesome5 name="book" size={22} color={colors.textOnPrimary} solid />
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
            <Text style={styles.statLabel}>Umum</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{data.jumlah_divisi}</Text>
            <Text style={styles.statLabel}>Divisi Saya</Text>
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
              <FontAwesome5
                name={materi.has_file ? "file-alt" : "link"}
                size={16}
                color={colors.primary}
                solid
              />
            </View>
            <View style={styles.previewBody}>
              <Text style={styles.previewItemTitle} numberOfLines={1}>
                {materi.judul}
              </Text>
              <Text style={styles.previewItemMeta} numberOfLines={1}>
                {materi.jenis_label} · {materi.tanggal}
              </Text>
            </View>
            <FontAwesome5 name="chevron-right" size={14} color={colors.neutral300} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={onPress} style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>Lihat semua materi</Text>
          <FontAwesome5 name="arrow-right" size={11} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing[2] + 2 },

  // ── Skeleton ──
  skeletonCard: {
    backgroundColor: colors.surface,
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
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.border,
  },
  emptyIcon: { fontSize: 36 },
  emptyTitle: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: colors.neutral600,
  },
  emptyDesc: {
    fontSize: 11,
    fontFamily: fontFamily.light,
    color: colors.neutral400,
    marginTop: 2,
  },

  // ── Summary card ──
  summaryCard: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    padding: 18,
    overflow: "hidden",
    position: "relative",
    shadowColor: colors.primary,
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
  summaryHeader: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
  summaryIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  summaryIconText: { fontSize: 22 },
  summaryLabel: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontFamily: fontFamily.regular,
  },
  summaryHint: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontFamily: fontFamily.light,
    marginTop: 1,
  },

  totalBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: spacing[3],
    paddingVertical: 5,
    borderRadius: 12,
    alignItems: "center",
  },
  totalBadgeNum: {
    color: colors.textOnPrimary,
    fontSize: 18,
    fontFamily: fontFamily.regular,
  },
  totalBadgeLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 9,
    fontFamily: fontFamily.regular,
  },

  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    padding: 4,
  },
  statBox: { flex: 1, alignItems: "center", paddingVertical: 8 },
  statDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.2)" },
  statNum: {
    color: colors.textOnPrimary,
    fontSize: 18,
    fontFamily: fontFamily.regular,
  },
  statLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 10,
    fontFamily: fontFamily.regular,
    marginTop: 1,
  },

  // ── Preview list ──
  previewWrap: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
    gap: spacing[2] + 2,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  previewTitle: {
    fontSize: 11,
    fontFamily: fontFamily.regular,
    color: colors.neutral400,
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
    backgroundColor: colors.badgeBg,
    justifyContent: "center",
    alignItems: "center",
  },
  previewIcon: { fontSize: 18 },
  previewBody: { flex: 1 },
  previewItemTitle: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    color: colors.textPrimary,
  },
  previewItemMeta: {
    fontSize: 11,
    fontFamily: fontFamily.light,
    color: colors.neutral400,
    marginTop: 1,
  },
  chevron: {
    color: colors.neutral300,
    fontSize: 22,
    fontFamily: fontFamily.light,
  },

  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: spacing[2] + 2,
    borderTopWidth: 1,
    borderTopColor: colors.neutral100,
  },
  viewAllText: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: fontFamily.regular,
  },
});
