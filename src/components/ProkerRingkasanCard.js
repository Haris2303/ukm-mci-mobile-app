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
import { FontAwesome5 } from "@expo/vector-icons";
import { getProker } from "../services/prokerApi";
import { colors, fontFamily, spacing } from "../theme/theme";

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
    return () => { mounted = false; };
  }, []);

  // ── Loading skeleton ─────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.skeleton}>
        <ActivityIndicator color={colors.primary} />
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
            <FontAwesome5 name="chart-bar" size={22} color={colors.textOnPrimary} solid />
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

        <View style={styles.statsRow}>
          <StatBox iconName="clipboard-list" label="Planning" value={statistik.planning} />
          <View style={styles.statDivider} />
          <StatBox iconName="rocket" label="Berjalan" value={statistik.active} />
          <View style={styles.statDivider} />
          <StatBox iconName="check-circle" label="Selesai" value={statistik.completed} />
        </View>

        {statistik.terlambat > 0 && (
          <View style={styles.terlambatBox}>
            <FontAwesome5 name="exclamation-triangle" size={11} color={colors.textOnPrimary} solid />
            <Text style={styles.terlambatText}>
              {statistik.terlambat} proker terlambat
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* ── Preview 2 proker terbaru ───────────────── */}
      <View style={styles.previewWrap}>
        <Text style={styles.previewTitle}>Terbaru</Text>
        {previewProker.map((p, idx) => (
          <ProkerPreviewItem
            key={p.id ?? `proker-preview-${idx}`}
            proker={p}
            onPress={onPress}
          />
        ))}
        <TouchableOpacity onPress={onPress} style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>Lihat semua proker</Text>
          <FontAwesome5 name="arrow-right" size={11} color={colors.violet} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── StatBox ──────────────────────────────────────────────
function StatBox({ iconName, label, value }) {
  return (
    <View style={styles.statBox}>
      <FontAwesome5 name={iconName} size={14} color="rgba(255,255,255,0.8)" solid />
      <Text style={styles.statNum}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ── Preview Item ─────────────────────────────────────────
function ProkerPreviewItem({ proker, onPress }) {
  const progressColor =
    proker.warna_progress === "success"
      ? colors.success
      : proker.warna_progress === "danger"
        ? colors.error
        : proker.warna_progress === "warning"
          ? colors.warning
          : colors.primary;

  return (
    <TouchableOpacity
      style={styles.previewItem}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.previewAccent, { backgroundColor: progressColor }]} />
      <View style={styles.previewBody}>
        <Text style={styles.previewName} numberOfLines={1}>
          {proker.nama_proker}
        </Text>
        <Text style={styles.previewMeta} numberOfLines={1}>
          {proker.jenis_label}
        </Text>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${proker.progress_persen}%`, backgroundColor: progressColor },
            ]}
          />
        </View>

        <View style={styles.progressMeta}>
          <Text style={[styles.progressPercent, { color: progressColor }]}>
            {proker.progress_persen}%
          </Text>
          {proker.is_terlambat ? (
            <View style={styles.terlambatRow}>
              <FontAwesome5 name="exclamation-triangle" size={10} color="#ef4444" solid />
              <Text style={[styles.previewSisa, { color: "#ef4444" }]}>Terlambat</Text>
            </View>
          ) : (
            <Text style={styles.previewSisa}>{proker.sisa_hari_label}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing[2] + 2 },

  skeleton: {
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

  // ── Summary card (violet — sesuai token colors.violet) ──
  summaryCard: {
    backgroundColor: colors.violet,
    borderRadius: 22,
    padding: 18,
    overflow: "hidden",
    position: "relative",
    shadowColor: colors.violet,
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
    padding: 6,
  },
  statBox: { flex: 1, alignItems: "center", paddingVertical: 6, gap: 2 },
  statDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.2)" },
  statEmoji: { fontSize: 16 },
  statNum: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontFamily: fontFamily.regular,
  },
  statLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 9,
    fontFamily: fontFamily.regular,
  },

  terlambatBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(239,68,68,0.25)",
    paddingHorizontal: spacing[3],
    paddingVertical: 8,
    borderRadius: 10,
  },
  terlambatText: {
    color: colors.textOnPrimary,
    fontSize: 11,
    fontFamily: fontFamily.regular,
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
    gap: spacing[3],
    paddingVertical: 6,
  },
  previewAccent: { width: 4, borderRadius: 2 },
  previewBody: { flex: 1, gap: 4 },
  previewName: {
    fontSize: 13,
    fontFamily: fontFamily.regular,
    color: colors.textPrimary,
  },
  previewMeta: {
    fontSize: 11,
    fontFamily: fontFamily.light,
    color: colors.neutral400,
  },

  progressBar: {
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.neutral100,
    overflow: "hidden",
    marginTop: 4,
  },
  progressFill: { height: "100%", borderRadius: 3 },

  progressMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressPercent: { fontSize: 11, fontFamily: fontFamily.regular },
  previewSisa: {
    fontSize: 10,
    fontFamily: fontFamily.light,
    color: colors.neutral400,
  },
  terlambatRow: { flexDirection: "row", alignItems: "center", gap: 4 },

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
    color: colors.violet,
    fontSize: 12,
    fontFamily: fontFamily.regular,
  },
});
