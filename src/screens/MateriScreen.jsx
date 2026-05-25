// src/screens/MateriScreen.js
// Halaman lengkap distribusi materi dengan filter, download, dan cache offline

import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Dimensions,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { getMateri } from "../services/materiApi";
import { useAsyncResource } from "../shared/hooks";
import { LoadingState, ErrorState } from "../shared/components";
import parseFaIconName from "../core/utils/parseFaIcon";
import { downloadAndOpen } from "../features/materi/services/materiDownloader";
import openExternalLink from "../core/utils/openExternalLink";

const screenWidth = Dimensions.get('window').width;

const FILTERS = [
  { key: "semua", label: "Semua", iconName: "book" },
  { key: "umum", label: "Umum", iconName: "globe" },
  { key: "divisi", label: "Divisi Saya", iconName: "users" },
];

export default function MateriScreen() {
  const [activeFilter, setActiveFilter] = useState("semua");
  const [downloadingId, setDownloadingId] = useState(null);

  const pageScrollRef = useRef(null);

  const fetchMateri = useCallback(async () => {
    const res = await getMateri();
    return res.data;
  }, []);

  const { data, loading, refreshing, error, refetch, refresh } = useAsyncResource(fetchMateri);

  const handleFilterPress = (key) => {
    const idx = FILTERS.findIndex((f) => f.key === key);
    setActiveFilter(key);
    pageScrollRef.current?.scrollTo({ x: idx * screenWidth, animated: true });
  };

  const handlePageChange = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
    if (idx >= 0 && idx < FILTERS.length) {
      setActiveFilter(FILTERS[idx].key);
    }
  };

  const handleDownloadDanBuka = async (materi) => {
    setDownloadingId(materi.id);
    try {
      await downloadAndOpen(materi);
    } catch (e) {
      Alert.alert("❌ Gagal Mengunduh", e.message);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleBukaLink = async (url) => {
    try {
      await openExternalLink(url);
    } catch (e) {
      Alert.alert("❌ Tidak Bisa Membuka", e.message);
    }
  };

  if (loading) return <LoadingState message="Memuat materi..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <View style={styles.container}>
      {/* ── Stats Strip ──────────────────────────────── */}
      <View style={styles.statsStrip}>
        <Text style={styles.statsText}>
          {data.total} materi tersedia · {data.jumlah_umum} umum +{" "}
          {data.jumlah_divisi} divisi
        </Text>
      </View>

      {/* ── Filter Bar ───────────────────────────────── */}
      <View style={styles.filterBar}>
        {FILTERS.map((f) => {
          const count =
            f.key === "semua"
              ? data.total
              : f.key === "umum"
                ? data.jumlah_umum
                : data.jumlah_divisi;
          const isActive = activeFilter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterTab, isActive && styles.filterTabActive]}
              onPress={() => handleFilterPress(f.key)}
              activeOpacity={0.7}
            >
              <FontAwesome5
                name={f.iconName}
                size={12}
                color={isActive ? "#fff" : "#64748b"}
                solid
              />
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

      {/* ── Content ──────────────────────────────────── */}
      <ScrollView
        ref={pageScrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handlePageChange}
        scrollEventThrottle={16}
        style={styles.content}
      >
        {FILTERS.map((f) => {
          const pageMateri =
            data?.materi?.filter((m) => {
              if (f.key === "semua") return true;
              if (f.key === "umum") return m.is_umum;
              if (f.key === "divisi") return !m.is_umum;
              return true;
            }) ?? [];
          return (
            <ScrollView
              key={f.key}
              style={styles.page}
              contentContainerStyle={styles.contentInner}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={refresh}
                  colors={["#1a4ff5"]}
                />
              }
              showsVerticalScrollIndicator={false}
            >
              {pageMateri.length === 0 ? (
                <View style={styles.emptyState}>
                  <FontAwesome5 name="inbox" size={48} color="#94a3b8" style={{ marginBottom: 8 }} />
                  <Text style={styles.emptyTitle}>Tidak Ada Materi</Text>
                  <Text style={styles.emptyDesc}>
                    {f.key === "umum"
                      ? "Belum ada materi umum yang dipublikasikan."
                      : f.key === "divisi"
                        ? "Belum ada materi khusus untuk divisi Anda."
                        : "Belum ada materi tersedia. Pantau terus halaman ini."}
                  </Text>
                </View>
              ) : (
                pageMateri.map((materi, mIdx) => (
                  <MateriCard
                    key={materi.id ?? `materi-${mIdx}`}
                    materi={materi}
                    isDownloading={downloadingId === materi.id}
                    onDownload={() => handleDownloadDanBuka(materi)}
                    onOpenLink={() => handleBukaLink(materi.link_url)}
                  />
                ))
              )}
              <View style={{ height: 30 }} />
            </ScrollView>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════
// MATERI CARD
// ═══════════════════════════════════════════════════════════
function MateriCard({ materi, isDownloading, onDownload, onOpenLink }) {
  const accentColor = materi.is_umum ? "#10b981" : "#1a4ff5";

  return (
    <View style={styles.card}>
      <View style={[styles.cardAccent, { backgroundColor: accentColor }]} />

      <View style={styles.cardBody}>
        <View style={[styles.jenisBadge, { backgroundColor: accentColor + "15" }]}>
          <FontAwesome5
            name={materi.is_umum ? "globe" : parseFaIconName(materi.divisi?.icon)}
            size={10}
            color={accentColor}
            solid
          />
          <Text style={[styles.jenisBadgeText, { color: accentColor }]}>
            {materi.is_umum ? "Umum" : (materi.divisi?.nama ?? "Divisi")}
          </Text>
        </View>

        <Text style={styles.cardTitle}>{materi.judul}</Text>

        {materi.deskripsi && (
          <Text style={styles.cardDesc} numberOfLines={3}>
            {materi.deskripsi}
          </Text>
        )}

        <View style={styles.metaRow}>
          <FontAwesome5 name="user" size={11} color="#94a3b8" solid />
          <Text style={styles.metaText}>{materi.uploader}</Text>
          <Text style={styles.metaDot}>·</Text>
          <FontAwesome5 name="calendar-alt" size={11} color="#94a3b8" solid />
          <Text style={styles.metaText}>{materi.tanggal}</Text>
        </View>

        <View style={styles.actionsRow}>
          {materi.has_file && (
            <TouchableOpacity
              style={[styles.btnPrimary, isDownloading && styles.btnDisabled]}
              onPress={onDownload}
              disabled={isDownloading}
              activeOpacity={0.85}
            >
              {isDownloading ? (
                <>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.btnPrimaryText}>Mengunduh...</Text>
                </>
              ) : (
                <>
                  <FontAwesome5 name="download" size={13} color="#fff" solid />
                  <Text style={styles.btnPrimaryText}>
                    Buka PDF{materi.file_size ? ` · ${materi.file_size}` : ""}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {materi.has_link && (
            <TouchableOpacity
              style={styles.btnSecondary}
              onPress={onOpenLink}
              activeOpacity={0.85}
            >
              <FontAwesome5 name="link" size={13} color="#1a4ff5" solid />
              <Text style={styles.btnSecondaryText}>Link</Text>
            </TouchableOpacity>
          )}
        </View>

        {!materi.has_file && !materi.has_link && (
          <View style={styles.noContentBox}>
            <View style={styles.noContentRow}>
              <FontAwesome5 name="info-circle" size={12} color="#94a3b8" solid />
              <Text style={styles.noContentText}>Materi ini belum memiliki file atau link</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4ff" },

  statsStrip: {
    backgroundColor: "#1a56db",
    paddingHorizontal: 24,
    paddingTop: 6,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  statsText: { fontSize: 13, color: "rgba(255,255,255,0.8)" },

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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
    gap: 4,
  },
  filterTabActive: { backgroundColor: "#1a4ff5" },
  filterIcon: { fontSize: 13 },
  filterLabel: { fontSize: 11, fontWeight: "700", color: "#64748b" },
  filterLabelActive: { color: "#fff" },
  filterBadge: {
    minWidth: 20,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeActive: { backgroundColor: "rgba(255,255,255,0.25)" },
  filterBadgeText: { fontSize: 10, fontWeight: "800", color: "#64748b" },
  filterBadgeTextActive: { color: "#fff" },

  content: { flex: 1 },
  page: { width: screenWidth },
  contentInner: { padding: 16, paddingTop: 18, gap: 12 },

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
  cardBody: { flex: 1, padding: 16, gap: 8 },

  jenisBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
  },
  jenisBadgeText: { fontSize: 10, fontWeight: "800" },

  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1e293b",
    lineHeight: 21,
  },
  cardDesc: { fontSize: 12, color: "#64748b", lineHeight: 18 },

  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  metaText: { fontSize: 11, color: "#94a3b8" },
  metaDot: { fontSize: 11, color: "#cbd5e1" },

  actionsRow: { flexDirection: "row", gap: 8, marginTop: 8 },

  btnPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a4ff5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 7,
  },
  btnDisabled: { opacity: 0.7 },
  btnPrimaryText: { color: "#fff", fontWeight: "700", fontSize: 12 },

  btnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#bfdbfe",
  },
  btnSecondaryText: { color: "#1a4ff5", fontWeight: "700", fontSize: 12 },

  noContentBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
  },
  noContentRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  noContentText: { fontSize: 11, color: "#94a3b8" },

  emptyState: {
    alignItems: "center",
    padding: 40,
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { fontSize: 17, fontWeight: "800", color: "#1e293b" },
  emptyDesc: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 19,
  },
});
