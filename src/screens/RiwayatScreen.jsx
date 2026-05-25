// src/screens/RiwayatScreen.js
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { getRiwayatPresensi } from "../services/api";
import { LoadingState, ErrorState, EmptyState, ScreenHeader } from "../shared/components";

export default function RiwayatScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const result = await getRiwayatPresensi();
      setData(result.data?.data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Format tanggal ───────────────────────────────────────────
  const formatTanggal = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatJam = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ── Render item riwayat ───────────────────────────────────────
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.statusDotBox}>
          <View
            style={[
              styles.dot,
              item.status === "Hadir" ? styles.dotHadir : styles.dotLain,
            ]}
          />
        </View>
        <View style={styles.timeLine} />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text style={styles.agendaName} numberOfLines={2}>
            {item.agenda?.nama_agenda ?? "–"}
          </Text>
          <View
            style={[
              styles.badge,
              item.status === "Hadir" ? styles.badgeHadir : styles.badgeLain,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                item.status === "Hadir"
                  ? styles.badgeTextHadir
                  : styles.badgeTextLain,
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <FontAwesome5 name="map-marker-alt" size={12} color="#94a3b8" solid />
          <Text style={styles.metaText}>
            {item.agenda?.lokasi ?? "Lokasi tidak tersedia"}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <FontAwesome5 name="clock" size={12} color="#94a3b8" solid />
          <Text style={styles.metaText}>
            Hadir pukul {formatJam(item.jam_hadir)}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <FontAwesome5 name="calendar-alt" size={12} color="#94a3b8" solid />
          <Text style={styles.metaText}>{formatTanggal(item.jam_hadir)}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) return <LoadingState message="Memuat riwayat..." />;

  if (error) return <ErrorState message={error} onRetry={() => fetchData()} />;

  const ListEmpty = () => (
    <EmptyState
      iconName="inbox"
      title="Belum Ada Riwayat"
      description="Riwayat presensi Anda akan muncul di sini setelah Anda berhasil scan QR Code."
    />
  );

  // ── Render: List ─────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Riwayat Presensi"
        subtitle={`${data.length} kehadiran tercatat`}
        backgroundColor="#1a56db"
      />

      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={[
          styles.listContent,
          data.length === 0 && styles.listContentEmpty,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchData(true)}
            colors={["#1a56db"]}
            tintColor="#1a56db"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4ff",
  },

  // List
  listContent: {
    padding: 20,
    gap: 14,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: "center",
  },

  // Card
  card: {
    flexDirection: "row",
    gap: 14,
  },
  cardLeft: {
    alignItems: "center",
    width: 20,
    paddingTop: 4,
  },
  statusDotBox: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  dotHadir: { backgroundColor: "#86efac", borderColor: "#22c55e" },
  dotLain: { backgroundColor: "#fde68a", borderColor: "#f59e0b" },
  timeLine: {
    flex: 1,
    width: 2,
    backgroundColor: "#e2e8f0",
    marginTop: 4,
    borderRadius: 2,
  },

  cardBody: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 8,
  },
  agendaName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
    lineHeight: 21,
  },

  // Badge status
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeHadir: { backgroundColor: "#dcfce7" },
  badgeLain: { backgroundColor: "#fef9c3" },
  badgeText: { fontSize: 11, fontWeight: "700" },
  badgeTextHadir: { color: "#15803d" },
  badgeTextLain: { color: "#92400e" },

  // Meta info
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  metaIconWrap: { width: 16, alignItems: "center" },
  metaText: { fontSize: 13, color: "#64748b", flex: 1 },

});
