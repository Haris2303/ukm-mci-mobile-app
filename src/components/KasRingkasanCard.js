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
import { FontAwesome5 } from "@expo/vector-icons";
import { useKas } from "../context/KasContext";
import { colors, fontFamily, radius, spacing } from "../theme/theme";

export default function KasRingkasanCard({ onPress }) {
  const {
    tunggakanCount,
    tunggakanTotal,
    saldoOrganisasi,
    loadingKas,
    refreshRingkasan,
  } = useKas();

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
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        <View style={styles.cardHeader}>
          <View style={styles.iconBox}>
            <FontAwesome5 name="coins" size={22} color={colors.textOnPrimary} solid />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerLabel}>Saldo Kas Organisasi</Text>
            <Text style={styles.headerSub}>Transparansi keuangan UKM</Text>
          </View>
        </View>

        {loadingKas && !saldoOrganisasi ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.textOnPrimary} />
          </View>
        ) : (
          <Text style={styles.saldoAngka}>
            {saldoOrganisasi?.total_saldo_format ?? "Rp —"}
          </Text>
        )}

        <View style={styles.metaRow}>
          <View style={styles.metaLeft}>
            <FontAwesome5 name="clock" size={11} color="rgba(255,255,255,0.7)" />
            <Text style={styles.metaText}>
              {saldoOrganisasi?.diperbarui_pada ?? "Memuat..."}
            </Text>
          </View>
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
            <FontAwesome5 name="exclamation-triangle" size={20} color="#92400e" solid />
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
            <FontAwesome5 name="chevron-right" size={14} color="#92400e" />
          </View>
        </TouchableOpacity>
      )}

      {/* ── Status lunas (jika tidak ada tunggakan) ─────── */}
      {!adaTunggakan && saldoOrganisasi && (
        <View style={styles.lunasCard}>
          <View style={styles.lunasIconBox}>
            <FontAwesome5 name="check-circle" size={20} color={colors.textOnPrimary} solid />
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
  wrapper: { gap: spacing[3] },

  // ── Card Saldo ──
  cardSaldo: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 22,
    overflow: "hidden",
    position: "relative",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
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
    gap: spacing[3],
    marginBottom: spacing[4],
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
  headerLabel: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontFamily: fontFamily.regular,
  },
  headerSub: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontFamily: fontFamily.light,
    marginTop: 1,
  },

  loadingBox: { paddingVertical: 12, alignItems: "flex-start" },

  saldoAngka: {
    color: colors.textOnPrimary,
    fontSize: 30,
    fontFamily: fontFamily.regular,
    letterSpacing: -0.5,
    marginBottom: 14,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
  },
  metaLeft: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontFamily: fontFamily.light,
  },

  // ── Alert Tunggakan ──
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
    backgroundColor: colors.warningLight,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#fcd34d",
    borderRadius: 16,
    padding: spacing[4],
  },
  alertIconBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: colors.warning,
    justifyContent: "center",
    alignItems: "center",
  },
  alertIcon: { fontSize: 22 },
  alertContent: { flex: 1 },
  alertTitle: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: "#92400e",
  },
  alertText: {
    fontSize: 12,
    fontFamily: fontFamily.light,
    color: "#a16207",
    marginTop: 2,
  },
  alertNominal: { fontFamily: fontFamily.regular, color: "#7c2d12" },
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
    fontFamily: fontFamily.regular,
    lineHeight: 18,
  },

  // ── Lunas ──
  lunasCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
    backgroundColor: colors.successLight,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#86efac",
    borderRadius: 16,
    padding: 14,
  },
  lunasIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.success,
    justifyContent: "center",
    alignItems: "center",
  },
  lunasIcon: { fontSize: 20 },
  lunasTitle: { fontSize: 13, fontFamily: fontFamily.regular, color: "#15803d" },
  lunasText: { fontSize: 11, fontFamily: fontFamily.light, color: "#16a34a", marginTop: 1 },
});
