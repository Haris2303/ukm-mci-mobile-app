import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, spacing, shadow } from "../../../theme/theme";
import BreakdownRow from "../components/BreakdownRow";

export default function TransparansiTab({ data }) {
  if (!data) return null;

  const isPositif = data.total_saldo >= 0;

  return (
    <View style={styles.container}>
      <View style={[styles.bigSaldo, !isPositif && { backgroundColor: colors.errorStrong }]}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        <View style={styles.labelRow}>
          <FontAwesome5 name="coins" size={13} color="rgba(255,255,255,0.85)" solid />
          <Text style={styles.label}>Saldo Kas Organisasi</Text>
        </View>
        <Text style={styles.saldoValue}>{data.total_saldo_format}</Text>
        <View style={styles.metaRow}>
          <FontAwesome5 name="clock" size={11} color="rgba(255,255,255,0.7)" solid />
          <Text style={styles.meta}>Diperbarui: {data.diperbarui_pada}</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Rincian Saldo</Text>

      <View style={styles.breakdownCard}>
        <BreakdownRow
          category="iuran"
          iconName="users"
          label="Iuran Anggota Lunas"
          value={data.rincian.iuran_lunas.format}
          isPositive
        />
        <View style={styles.divider} />
        <BreakdownRow
          category="donasi"
          iconName="gift"
          label="Donasi & Bantuan"
          value={data.rincian.kas_masuk.format}
          isPositive
        />
        <View style={styles.divider} />
        <BreakdownRow
          category="expense"
          iconName="shopping-cart"
          label="Pengeluaran"
          value={data.rincian.kas_keluar.format}
          isPositive={false}
        />
        <View style={[styles.divider, { backgroundColor: colors.brand, height: 2 }]} />
        <BreakdownRow
          category="total"
          iconName="gem"
          label="Saldo Akhir"
          value={data.total_saldo_format}
          isTotal
          isPositive={isPositif}
        />
      </View>

      <View style={styles.disclaimerBox}>
        <FontAwesome5 name="info-circle" size={16} color="#64748b" solid />
        <Text style={styles.disclaimerText}>
          Data ini diperbarui secara real-time dari pencatatan Bendahara. Jika
          menemukan ketidaksesuaian, harap hubungi pengurus segera.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#64748b",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginTop: 6,
    marginBottom: 2,
  },
  bigSaldo: {
    backgroundColor: colors.brand,
    borderRadius: 24,
    padding: 26,
    overflow: "hidden",
    position: "relative",
    // Colored shadow — intentional, tidak pakai shadow preset
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  circle1: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  circle2: {
    position: "absolute",
    bottom: -40,
    left: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(15,244,198,0.1)",
  },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  label: { color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: "700" },
  saldoValue: {
    color: colors.labelOnPrimary,
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: -1,
    marginBottom: spacing[2],
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  meta: { color: "rgba(255,255,255,0.7)", fontSize: 12 },
  breakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 6,
    ...shadow.xs,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.neutral200,
    marginHorizontal: spacing[3],
  },
  disclaimerBox: {
    backgroundColor: colors.neutral50,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  disclaimerText: { flex: 1, fontSize: 11, color: "#64748b", lineHeight: 17 },
});
