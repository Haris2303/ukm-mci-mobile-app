// src/screens/voting/ElectionListScreen.js
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { getElections } from "../../services/votingApi";

const STATUS_CONFIG = {
  aktif: { label: "Berlangsung", color: "#059669", bg: "#d1fae5" },
  selesai: { label: "Selesai", color: "#1d4ed8", bg: "#dbeafe" },
  draft: { label: "Akan Datang", color: "#92400e", bg: "#fef3c7" },
};

export default function ElectionListScreen({ navigation }) {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const res = await getElections();
      setElections(res.data ?? []);
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

  const renderItem = ({ item }) => {
    const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.draft;
    const isAktif = item.status === "aktif";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("ElectionDetail", {
            id: item.id,
            judul: item.judul,
          })
        }
        activeOpacity={0.85}
      >
        {/* Garis aksen kiri */}
        <View style={[styles.accent, { backgroundColor: cfg.color }]} />

        <View style={styles.cardContent}>
          <View style={styles.cardTop}>
            <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
              <View style={[styles.badgeDot, { backgroundColor: cfg.color }]} />
              <Text style={[styles.badgeText, { color: cfg.color }]}>
                {cfg.label}
              </Text>
            </View>
            {item.sudah_vote && (
              <View style={styles.votedBadge}>
                <Text style={styles.votedText}>✓ Sudah Memilih</Text>
              </View>
            )}
          </View>

          <Text style={styles.posisi}>{item.posisi}</Text>
          <Text style={styles.judul}>{item.judul}</Text>

          <View style={styles.metaRow}>
            <MetaChip
              iconName="users"
              label={`${item.kandidat?.length ?? 0} Kandidat`}
            />
            <MetaChip iconName="vote-yea" label={`${item.total_suara} Suara`} />
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.waktuRow}>
              <FontAwesome5 name={isAktif ? "clock" : "calendar-alt"} size={11} color="#94a3b8" solid />
              <Text style={styles.waktu}>
                {isAktif ? `Berakhir: ${item.waktu_selesai}` : item.waktu_mulai}
              </Text>
            </View>
            <View style={[styles.btnDetail, { backgroundColor: cfg.color }]}>
              <Text style={styles.btnDetailText}>
                {item.sudah_vote
                  ? "Lihat Hasil →"
                  : isAktif
                    ? "Pilih Sekarang →"
                    : "Lihat Detail →"}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a56db" />
        <Text style={styles.loadingText}>Memuat data pemilihan...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>E-Voting UKM MCI</Text>
        <Text style={styles.headerSub}>Pemilihan Pengurus Periode Aktif</Text>
      </View>

      <FlatList
        data={elections}
        keyExtractor={(i) => String(i.id)}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          elections.length === 0 && styles.listEmpty,
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <FontAwesome5 name="vote-yea" size={48} color="#94a3b8" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyTitle}>Belum Ada Pemilihan</Text>
            <Text style={styles.emptySub}>
              Pemilihan yang aktif akan muncul di sini.
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchData(true)}
            colors={["#1a56db"]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function MetaChip({ iconName, label }) {
  return (
    <View style={styles.chip}>
      <FontAwesome5 name={iconName} size={11} color="#64748b" solid />
      <Text style={styles.chipLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4ff" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#f0f4ff",
  },
  loadingText: { color: "#94a3b8", fontSize: 14 },

  header: {
    backgroundColor: "#1a56db",
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

  list: { padding: 20, gap: 16 },
  listEmpty: { flexGrow: 1, justifyContent: "center" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  accent: { width: 6 },
  cardContent: { flex: 1, padding: 18, gap: 8 },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeDot: { width: 7, height: 7, borderRadius: 4 },
  badgeText: { fontSize: 11, fontWeight: "700" },

  votedBadge: {
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#86efac",
  },
  votedText: { fontSize: 11, fontWeight: "700", color: "#15803d" },

  posisi: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  judul: { fontSize: 17, fontWeight: "800", color: "#1e293b", lineHeight: 24 },

  metaRow: { flexDirection: "row", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chipLabel: { fontSize: 12, color: "#64748b", fontWeight: "600" },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  waktuRow: { flexDirection: "row", alignItems: "center", gap: 5, flex: 1 },
  waktu: { fontSize: 12, color: "#94a3b8", flex: 1 },
  btnDetail: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10 },
  btnDetailText: { color: "#fff", fontSize: 12, fontWeight: "700" },

  empty: { alignItems: "center", gap: 12, padding: 32 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  emptySub: { fontSize: 14, color: "#94a3b8", textAlign: "center" },
});
