// src/screens/voting/HasilVotingScreen.js
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from "react-native";
import { getHasil } from "../../services/votingApi";

const COLORS = ["#1a56db", "#059669", "#d97706", "#7c3aed", "#dc2626"];

export default function HasilVotingScreen({ route, navigation }) {
  const { id } = route.params;
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getHasil(id);
        setHasil(res.data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a56db" />
        <Text style={styles.loadingText}>Memuat hasil pemilihan...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>🔒</Text>
        <Text style={styles.errorTitle}>Hasil Belum Tersedia</Text>
        <Text style={styles.errorMsg}>{error}</Text>
        <TouchableOpacity
          style={styles.btnBack}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.btnBackText}>← Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pemenang = hasil.pemenang;
  const kandidat = hasil.kandidat ?? [];
  const isSelesai = hasil.election.status === "selesai";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>{hasil.election.posisi}</Text>
        <Text style={styles.headerTitle}>{hasil.election.judul}</Text>
        <View
          style={[
            styles.statusBadge,
            isSelesai ? styles.badgeSelesai : styles.badgeAktif,
          ]}
        >
          <Text style={styles.statusText}>
            {isSelesai ? "🏁 Pemilihan Selesai" : "🟢 Sedang Berlangsung"}
          </Text>
        </View>
      </View>

      {/* Total Suara */}
      <View style={styles.totalBox}>
        <Text style={styles.totalAngka}>{hasil.total_suara}</Text>
        <Text style={styles.totalLabel}>Total Suara Sah</Text>
      </View>

      {/* Pemenang (jika selesai) */}
      {isSelesai && pemenang && (
        <View style={styles.pemenangCard}>
          <Text style={styles.pemenangMahkota}>👑</Text>
          <Text style={styles.pemenangLabel}>TERPILIH</Text>
          <Text style={styles.pemenangNama}>{pemenang.nama}</Text>
          <Text style={styles.pemenangPosisi}>{hasil.election.posisi}</Text>
          <View style={styles.pemenangStats}>
            <StatBox nilai={pemenang.jumlah_suara} label="Suara" />
            <View style={styles.statDivider} />
            <StatBox nilai={`${pemenang.persentase}%`} label="Perolehan" />
          </View>
        </View>
      )}

      {/* Bar Chart Semua Kandidat */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Perolehan Suara</Text>
        {kandidat.map((k, idx) => (
          <BarRow
            key={k.urut}
            kandidat={k}
            color={COLORS[idx % COLORS.length]}
            isPemenang={isSelesai && idx === 0}
          />
        ))}
      </View>

      {/* Keterangan Anonimitas */}
      <View style={styles.anonBox}>
        <Text style={styles.anonIcon}>🔒</Text>
        <Text style={styles.anonText}>
          Identitas pemilih dirahasiakan. Hasil ini hanya menampilkan jumlah
          suara tanpa informasi siapa yang memilih siapa.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.btnBack2}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.btnBack2Text}>← Kembali ke Daftar Pemilihan</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// Bar animasi per kandidat
function BarRow({ kandidat, color, isPemenang }) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const persen = kandidat.persentase ?? 0;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: persen / 100,
      duration: 900,
      delay: kandidat.peringkat * 100,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={[styles.barRow, isPemenang && styles.barRowWinner]}>
      <View style={styles.barLeft}>
        <View style={styles.barHeader}>
          <Text style={styles.barNama}>{kandidat.nama}</Text>
          {isPemenang && <Text style={styles.winnerTag}>🏆 Terpilih</Text>}
        </View>
        <View style={styles.barTrack}>
          <Animated.View
            style={[
              styles.barFill,
              { backgroundColor: color },
              {
                width: widthAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
      </View>
      <View style={styles.barRight}>
        <Text style={[styles.barPersen, { color }]}>{persen}%</Text>
        <Text style={styles.barSuara}>{kandidat.jumlah_suara} suara</Text>
      </View>
    </View>
  );
}

function StatBox({ nilai, label }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statNilai}>{nilai}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
  errorIcon: { fontSize: 48 },
  errorTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  errorMsg: { fontSize: 14, color: "#64748b", textAlign: "center" },
  btnBack: {
    backgroundColor: "#1a56db",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  btnBackText: { color: "#fff", fontWeight: "600" },

  header: {
    backgroundColor: "#1a56db",
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    gap: 6,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.65)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#fff" },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 4,
  },
  badgeSelesai: { backgroundColor: "rgba(255,255,255,0.2)" },
  badgeAktif: { backgroundColor: "rgba(74,222,128,0.25)" },
  statusText: { fontSize: 12, fontWeight: "700", color: "#fff" },

  totalBox: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    elevation: 4,
  },
  totalAngka: { fontSize: 48, fontWeight: "900", color: "#1a56db" },
  totalLabel: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "600",
    marginTop: 2,
  },

  // Pemenang
  pemenangCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    gap: 6,
    borderWidth: 2,
    borderColor: "#fbbf24",
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    elevation: 8,
  },
  pemenangMahkota: { fontSize: 44, marginBottom: 4 },
  pemenangLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#f59e0b",
    letterSpacing: 2,
  },
  pemenangNama: {
    fontSize: 26,
    fontWeight: "900",
    color: "#1e293b",
    textAlign: "center",
  },
  pemenangPosisi: { fontSize: 13, color: "#64748b" },
  pemenangStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 20,
  },
  statDivider: { width: 1, height: 36, backgroundColor: "#e2e8f0" },
  statBox: { alignItems: "center", gap: 2 },
  statNilai: { fontSize: 22, fontWeight: "800", color: "#1a56db" },
  statLabel: { fontSize: 11, color: "#94a3b8", fontWeight: "600" },

  // Chart
  section: { paddingHorizontal: 20, paddingBottom: 0 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 16,
  },

  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    elevation: 2,
  },
  barRowWinner: {
    borderWidth: 2,
    borderColor: "#fbbf24",
    backgroundColor: "#fffbeb",
  },
  barLeft: { flex: 1, gap: 8 },
  barHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  barNama: { fontSize: 15, fontWeight: "700", color: "#1e293b", flex: 1 },
  winnerTag: { fontSize: 11, fontWeight: "700", color: "#d97706" },
  barTrack: {
    height: 10,
    backgroundColor: "#f1f5f9",
    borderRadius: 5,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 5 },
  barRight: { alignItems: "flex-end", gap: 2, minWidth: 60 },
  barPersen: { fontSize: 18, fontWeight: "800" },
  barSuara: { fontSize: 11, color: "#94a3b8" },

  // Anonimitas
  anonBox: {
    margin: 20,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  anonIcon: { fontSize: 22 },
  anonText: { flex: 1, fontSize: 12, color: "#64748b", lineHeight: 18 },

  btnBack2: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
  },
  btnBack2Text: { color: "#475569", fontWeight: "600", fontSize: 14 },
});
