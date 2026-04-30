// src/screens/voting/ElectionDetailScreen.js
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Animated,
} from "react-native";
import { getElectionDetail, kirimSuara } from "../../services/votingApi";

export default function ElectionDetailScreen({ route, navigation }) {
  const { id } = route.params;

  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // candidate_id yang dipilih
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);

  // Animasi modal konfirmasi
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getElectionDetail(id);
      setElection(res.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // Animasi saat modal muncul
  useEffect(() => {
    if (showConfirm) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 8,
      }).start();
    } else {
      scaleAnim.setValue(0.85);
    }
  }, [showConfirm]);

  const handlePilihKandidat = (candidateId) => {
    if (election?.sudah_vote || election?.status !== "aktif") return;
    setSelected(candidateId);
  };

  const handleKirimSuara = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await kirimSuara(id, selected);
      setShowConfirm(false);
      Alert.alert(
        "✅ Suara Berhasil Dicatat",
        "Terima kasih! Suara Anda telah diterima dan dirahasiakan.",
        [
          {
            text: "Lihat Hasil",
            onPress: () => navigation.navigate("HasilVoting", { id }),
          },
        ],
      );
      fetchDetail(); // Refresh data
    } catch (e) {
      setShowConfirm(false);
      Alert.alert("❌ Gagal", e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCandidate = election?.kandidat?.find((c) => c.id === selected);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a56db" />
      </View>
    );
  }

  if (error || !election) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>😕</Text>
        <Text style={styles.errorMsg}>{error ?? "Data tidak ditemukan."}</Text>
        <TouchableOpacity style={styles.btnRetry} onPress={fetchDetail}>
          <Text style={styles.btnRetryText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isAktif = election.status === "aktif";
  const sudahVote = election.sudah_vote;
  const canVote = isAktif && !sudahVote;

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <View style={styles.header}>
          <Text style={styles.posisi}>{election.posisi}</Text>
          <Text style={styles.judul}>{election.judul}</Text>
          {election.deskripsi ? (
            <Text style={styles.deskripsi}>{election.deskripsi}</Text>
          ) : null}
          <View style={styles.headerMeta}>
            <MetaItem icon="⏰" label={`Berakhir ${election.waktu_selesai}`} />
            <MetaItem icon="🗳️" label={`${election.total_suara} suara masuk`} />
          </View>
        </View>

        {/* Banner Status */}
        {sudahVote && (
          <View style={styles.bannerSudahVote}>
            <Text style={styles.bannerIcon}>✅</Text>
            <View>
              <Text style={styles.bannerTitle}>Anda Sudah Memilih</Text>
              <Text style={styles.bannerSub}>
                {election.hasil_tersedia
                  ? "Scroll ke bawah untuk melihat perolehan suara."
                  : "Hasil akan ditampilkan setelah voting ditutup."}
              </Text>
            </View>
          </View>
        )}

        {!isAktif && !sudahVote && (
          <View
            style={[
              styles.bannerSudahVote,
              { borderColor: "#93c5fd", backgroundColor: "#eff6ff" },
            ]}
          >
            <Text style={styles.bannerIcon}>🏁</Text>
            <Text style={styles.bannerTitle}>Voting Telah Ditutup</Text>
          </View>
        )}

        {/* Daftar Kandidat */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {canVote ? "🗳️  Pilih Kandidat Anda" : "👥  Daftar Kandidat"}
          </Text>
          <Text style={styles.sectionSub}>
            {canVote
              ? "Tap pada kartu kandidat untuk memilih. Satu suara tidak dapat diubah."
              : ""}
          </Text>

          {election.kandidat?.map((kandidat) => (
            <KandidatCard
              key={kandidat.id}
              kandidat={kandidat}
              isSelected={selected === kandidat.id}
              canVote={canVote}
              showHasil={election.hasil_tersedia}
              totalSuara={election.total_suara}
              onPress={() => handlePilihKandidat(kandidat.id)}
            />
          ))}
        </View>

        {/* Tombol Lihat Hasil */}
        {election.hasil_tersedia && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.btnHasil}
              onPress={() => navigation.navigate("HasilVoting", { id })}
            >
              <Text style={styles.btnHasilText}>
                📊 Lihat Rekap Hasil Lengkap
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Tombol Vote (sticky bawah) */}
      {canVote && (
        <View style={styles.stickyBottom}>
          <TouchableOpacity
            style={[styles.btnVote, !selected && styles.btnVoteDisabled]}
            onPress={() => selected && setShowConfirm(true)}
            disabled={!selected}
            activeOpacity={0.9}
          >
            <Text style={styles.btnVoteText}>
              {selected
                ? "✓  Konfirmasi Pilihan Saya"
                : "Pilih Kandidat Terlebih Dahulu"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal Konfirmasi */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[styles.modalCard, { transform: [{ scale: scaleAnim }] }]}
          >
            <Text style={styles.modalIcon}>🗳️</Text>
            <Text style={styles.modalTitle}>Konfirmasi Pilihan</Text>
            <Text style={styles.modalSub}>
              Anda akan memberikan suara kepada:
            </Text>
            <View style={styles.modalCandidateBox}>
              <Text style={styles.modalCandidateName}>
                {selectedCandidate?.nama}
              </Text>
              <Text style={styles.modalCandidateUrut}>
                Kandidat No. {selectedCandidate?.urut}
              </Text>
            </View>
            <Text style={styles.modalWarning}>
              ⚠️ Pilihan tidak dapat diubah setelah dikonfirmasi.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.btnBatal}
                onPress={() => setShowConfirm(false)}
                disabled={submitting}
              >
                <Text style={styles.btnBatalText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnKonfirmasi, submitting && { opacity: 0.7 }]}
                onPress={handleKirimSuara}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.btnKonfirmasiText}>Ya, Konfirmasi</Text>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

// ── Komponen Kartu Kandidat ────────────────────────────────────
function KandidatCard({
  kandidat,
  isSelected,
  canVote,
  showHasil,
  totalSuara,
  onPress,
}) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const persen = kandidat.persentase ?? 0;

  useEffect(() => {
    if (showHasil) {
      Animated.timing(progressAnim, {
        toValue: persen / 100,
        duration: 800,
        delay: kandidat.urut * 100,
        useNativeDriver: false,
      }).start();
    }
  }, [showHasil, persen]);

  return (
    <TouchableOpacity
      style={[
        styles.kandidatCard,
        isSelected && styles.kandidatCardSelected,
        !canVote && { opacity: 0.95 },
      ]}
      onPress={onPress}
      activeOpacity={canVote ? 0.85 : 1}
    >
      {/* Nomor urut */}
      <View style={[styles.nomorUrut, isSelected && styles.nomorUrutSelected]}>
        <Text style={[styles.nomorUrutText, isSelected && { color: "#fff" }]}>
          {kandidat.urut}
        </Text>
      </View>

      <View style={styles.kandidatBody}>
        <View style={styles.kandidatHeader}>
          <Text style={styles.kandidatNama}>{kandidat.nama}</Text>
          {isSelected && <Text style={styles.checkMark}>✓</Text>}
        </View>

        {kandidat.visi ? (
          <Text style={styles.visi} numberOfLines={2}>
            💡 {kandidat.visi}
          </Text>
        ) : null}

        {/* Progress bar hasil */}
        {showHasil && (
          <View style={styles.hasilBox}>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.hasilText}>
              {kandidat.jumlah_suara} suara ({persen}%)
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function MetaItem({ icon, label }) {
  return (
    <View style={styles.metaItem}>
      <Text>{icon}</Text>
      <Text style={styles.metaLabel}>{label}</Text>
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
    padding: 32,
  },
  errorIcon: { fontSize: 48 },
  errorMsg: { fontSize: 14, color: "#64748b", textAlign: "center" },
  btnRetry: {
    backgroundColor: "#1a56db",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  btnRetryText: { color: "#fff", fontWeight: "600" },

  // Header
  header: {
    backgroundColor: "#1a56db",
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    gap: 6,
  },
  posisi: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  judul: { fontSize: 22, fontWeight: "800", color: "#fff", lineHeight: 30 },
  deskripsi: { fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 20 },
  headerMeta: { flexDirection: "row", gap: 16, marginTop: 8 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaLabel: { fontSize: 12, color: "rgba(255,255,255,0.8)" },

  // Banner
  bannerSudahVote: {
    margin: 20,
    marginBottom: 0,
    backgroundColor: "#f0fdf4",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1.5,
    borderColor: "#86efac",
  },
  bannerIcon: { fontSize: 28 },
  bannerTitle: { fontSize: 15, fontWeight: "700", color: "#15803d" },
  bannerSub: { fontSize: 12, color: "#16a34a", marginTop: 2 },

  // Section
  section: { padding: 20, paddingBottom: 0 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 4,
  },
  sectionSub: { fontSize: 12, color: "#94a3b8", marginBottom: 16 },

  // Kandidat card
  kandidatCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    gap: 14,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  kandidatCardSelected: {
    borderColor: "#1a56db",
    backgroundColor: "#eff6ff",
    shadowColor: "#1a56db",
    shadowOpacity: 0.15,
    elevation: 6,
  },
  nomorUrut: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  nomorUrutSelected: { backgroundColor: "#1a56db" },
  nomorUrutText: { fontSize: 20, fontWeight: "800", color: "#64748b" },

  kandidatBody: { flex: 1, gap: 6 },
  kandidatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  kandidatNama: { fontSize: 17, fontWeight: "700", color: "#1e293b", flex: 1 },
  checkMark: { fontSize: 20, color: "#1a56db" },
  visi: { fontSize: 13, color: "#64748b", lineHeight: 19 },

  // Progress
  hasilBox: { marginTop: 8, gap: 5 },
  progressTrack: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: { height: "100%", backgroundColor: "#1a56db", borderRadius: 4 },
  hasilText: { fontSize: 12, color: "#1a56db", fontWeight: "600" },

  // Hasil button
  btnHasil: {
    backgroundColor: "#eff6ff",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#bfdbfe",
  },
  btnHasilText: { color: "#1d4ed8", fontWeight: "700", fontSize: 15 },

  // Sticky bottom
  stickyBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    elevation: 12,
  },
  btnVote: {
    backgroundColor: "#1a56db",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    shadowColor: "#1a56db",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    elevation: 6,
  },
  btnVoteDisabled: { backgroundColor: "#94a3b8", shadowOpacity: 0 },
  btnVoteText: { color: "#fff", fontWeight: "800", fontSize: 16 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    padding: 28,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 32,
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    elevation: 20,
  },
  modalIcon: { fontSize: 48, marginBottom: 4 },
  modalTitle: { fontSize: 22, fontWeight: "800", color: "#1e293b" },
  modalSub: { fontSize: 14, color: "#64748b" },
  modalCandidateBox: {
    backgroundColor: "#eff6ff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    alignItems: "center",
    gap: 4,
    borderWidth: 1.5,
    borderColor: "#bfdbfe",
  },
  modalCandidateName: { fontSize: 20, fontWeight: "800", color: "#1a56db" },
  modalCandidateUrut: { fontSize: 13, color: "#64748b" },
  modalWarning: {
    fontSize: 12,
    color: "#f59e0b",
    textAlign: "center",
    lineHeight: 18,
  },
  modalButtons: { flexDirection: "row", gap: 12, width: "100%", marginTop: 8 },
  btnBatal: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  btnBatalText: { fontWeight: "700", color: "#64748b", fontSize: 15 },
  btnKonfirmasi: {
    flex: 1,
    backgroundColor: "#1a56db",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    shadowColor: "#1a56db",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    elevation: 5,
  },
  btnKonfirmasiText: { fontWeight: "700", color: "#fff", fontSize: 15 },
});
