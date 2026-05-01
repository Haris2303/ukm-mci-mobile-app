// src/components/KasRingkasanCard.js
// Card ringkasan E-Kas untuk ditampilkan di HomeScreen.
// Menampilkan saldo organisasi + alert tunggakan pribadi (jika ada).

import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useKas } from "../context/KasContext";

export default function KasRingkasanCard({ onPress }) {
  const {
    tunggakanCount,
    tunggakanTotal,
    saldoOrganisasi,
    loadingKas,
    refreshRingkasan,
  } = useKas();

  // Auto-refresh saat card di-mount
  useEffect(() => {
    refreshRingkasan();
  }, []);

  const adaTunggakan = tunggakanCount > 0;

  return (
    <View style={styles.wrapper}>
      {/* ── Card utama: Saldo Organisasi ───────────────────── */}
      <TouchableOpacity
        style={styles.cardSaldo}
        activeOpacity={0.92}
        onPress={onPress}
      >
        {/* Decorative circles */}
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        <View style={styles.cardHeader}>
          <View style={styles.iconBox}>
            <Text style={styles.iconEmoji}>💰</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerLabel}>Saldo Kas Organisasi</Text>
            <Text style={styles.headerSub}>Transparansi keuangan UKM</Text>
          </View>
        </View>

        {loadingKas && !saldoOrganisasi ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#fff" />
          </View>
        ) : (
          <Text style={styles.saldoAngka}>
            {saldoOrganisasi?.total_saldo_format ?? "Rp —"}
          </Text>
        )}

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            🕐 {saldoOrganisasi?.diperbarui_pada ?? "Memuat..."}
          </Text>
          <Text style={styles.metaCta}>Lihat detail →</Text>
        </View>
      </TouchableOpacity>

      {/* ── Alert tunggakan (hanya jika ada) ─────────────── */}
      {adaTunggakan && (
        <TouchableOpacity
          style={styles.alertCard}
          activeOpacity={0.92}
          onPress={onPress}
        >
          <View style={styles.alertIconBox}>
            <Text style={styles.alertIcon}>⚠️</Text>
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Anda Memiliki Tunggakan</Text>
            <Text style={styles.alertText}>
              {tunggakanCount} bulan belum dibayar · Total{" "}
              <Text style={styles.alertNominal}>
                Rp {tunggakanTotal.toLocaleString("id-ID")}
              </Text>
            </Text>
          </View>
          <View style={styles.alertChevron}>
            <Text style={styles.chevronText}>›</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* ── Status lunas (jika tidak ada tunggakan) ─────── */}
      {!adaTunggakan && saldoOrganisasi && (
        <View style={styles.lunasCard}>
          <View style={styles.lunasIconBox}>
            <Text style={styles.lunasIcon}>✅</Text>
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.lunasTitle}>Iuran Anda Lunas</Text>
            <Text style={styles.lunasText}>
              Terima kasih atas ketertiban Anda 🎉
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 12 },

  // ── Card Saldo (gradient feel) ──
  cardSaldo: {
    backgroundColor: "#1a4ff5",
    borderRadius: 24,
    padding: 22,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#1a4ff5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  circle1: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  circle2: {
    position: "absolute",
    bottom: -30,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(15,244,198,0.1)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconEmoji: { fontSize: 22 },
  headerText: { flex: 1 },
  headerLabel: { color: "#fff", fontSize: 14, fontWeight: "700" },
  headerSub: { color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 1 },

  loadingBox: { paddingVertical: 12, alignItems: "flex-start" },

  saldoAngka: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 14,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
  },
  metaText: { color: "rgba(255,255,255,0.7)", fontSize: 11 },
  metaCta: { color: "#0ff4c6", fontSize: 12, fontWeight: "700" },

  // ── Alert Tunggakan ──
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fef3c7",
    borderWidth: 1.5,
    borderColor: "#fcd34d",
    borderRadius: 16,
    padding: 16,
  },
  alertIconBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#fbbf24",
    justifyContent: "center",
    alignItems: "center",
  },
  alertIcon: { fontSize: 22 },
  alertContent: { flex: 1 },
  alertTitle: { fontSize: 14, fontWeight: "800", color: "#92400e" },
  alertText: { fontSize: 12, color: "#a16207", marginTop: 2 },
  alertNominal: { fontWeight: "800", color: "#7c2d12" },
  alertChevron: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: "rgba(217,119,6,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  chevronText: {
    color: "#92400e",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 18,
  },

  // ── Lunas (positive feedback) ──
  lunasCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#f0fdf4",
    borderWidth: 1.5,
    borderColor: "#86efac",
    borderRadius: 16,
    padding: 14,
  },
  lunasIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
  },
  lunasIcon: { fontSize: 20 },
  lunasTitle: { fontSize: 13, fontWeight: "800", color: "#15803d" },
  lunasText: { fontSize: 11, color: "#16a34a", marginTop: 1 },
});
