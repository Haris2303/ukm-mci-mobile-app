import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, spacing, shadow } from "../../../theme/theme";
import EmptyKas from "../components/EmptyKas";

export default function RiwayatTab({ data }) {
  if (!data || data.jumlah_pembayaran === 0) {
    return (
      <EmptyKas
        iconName="inbox"
        title="Belum Ada Riwayat"
        desc="Riwayat pembayaran Anda akan muncul di sini setelah Bendahara mencatat pembayaran iuran."
        bgColor={colors.neutral50}
        accentColor="#94a3b8"
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.summaryCard, styles.summaryCardSuccess]}>
        <View style={[styles.summaryIconBox, styles.summaryIconBoxSuccess]}>
          <FontAwesome5 name="check-circle" size={24} color={colors.labelOnPrimary} solid />
        </View>
        <View style={styles.summaryContent}>
          <Text style={styles.summaryLabel}>Total Sudah Dibayar</Text>
          <Text style={[styles.summaryValue, { color: colors.successText }]}>
            {data.total_dibayar_format}
          </Text>
          <Text style={styles.summaryMeta}>
            {data.jumlah_pembayaran} kali pembayaran
          </Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Riwayat Pembayaran</Text>

      {data.riwayat.map((item, idx) => (
        <View key={item.id ?? `riwayat-${idx}`} style={styles.timelineItem}>
          <View style={styles.timelineLeft}>
            <View style={styles.timelineDot}>
              <Text style={styles.timelineDotIcon}>✓</Text>
            </View>
            {idx < data.riwayat.length - 1 && (
              <View style={styles.timelineLine} />
            )}
          </View>

          <View style={styles.timelineCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemPeriode}>{item.bulan_tagihan_format}</Text>
              <View style={styles.statusBadgeLunas}>
                <Text style={styles.statusBadgeLunasText}>✓ Lunas</Text>
              </View>
            </View>
            <Text style={[styles.itemNominal, { color: colors.successText }]}>
              {item.nominal_format}
            </Text>
            <View style={styles.metaRow}>
              <FontAwesome5 name="clock" size={11} color="#94a3b8" solid />
              <Text style={styles.itemMeta}>Dibayar: {item.tanggal_bayar_format} WIT</Text>
            </View>
            {item.catatan && (
              <View style={styles.catatanRow}>
                <FontAwesome5 name="comment-alt" size={11} color="#64748b" solid />
                <Text style={styles.itemCatatan} numberOfLines={2}>
                  {item.catatan}
                </Text>
              </View>
            )}
          </View>
        </View>
      ))}
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
  summaryCard: {
    backgroundColor: colors.warningBg,
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.warningBorder,
  },
  summaryCardSuccess: { backgroundColor: colors.successBg, borderColor: colors.successBorder },
  summaryIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.warningIcon,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryIconBoxSuccess: { backgroundColor: colors.successIconBg },
  summaryContent: { flex: 1 },
  summaryLabel: { fontSize: 12, color: colors.warningText, fontWeight: "600" },
  summaryValue: { fontSize: 22, fontWeight: "900", color: colors.warningText, marginTop: 2 },
  summaryMeta: { fontSize: 11, color: colors.warningMuted, marginTop: 2 },
  timelineItem: { flexDirection: "row", gap: spacing[3] },
  timelineLeft: { alignItems: "center", width: 26 },
  timelineDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.successIconBg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#dcfce7",
  },
  timelineDotIcon: { color: colors.labelOnPrimary, fontSize: 12, fontWeight: "900" },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: "#e2e8f0",
    marginTop: 4,
    marginBottom: -14,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 14,
    gap: 5,
    ...shadow.xs,
    marginBottom: spacing[2],
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemPeriode: { fontSize: 14, fontWeight: "800", color: "#1e293b" },
  itemNominal: { fontSize: 18, fontWeight: "900", color: colors.warningText },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  catatanRow: { flexDirection: "row", alignItems: "flex-start", gap: 5 },
  itemCatatan: { flex: 1, fontSize: 12, color: "#64748b", fontStyle: "italic" },
  itemMeta: { fontSize: 11, color: "#94a3b8" },
  statusBadgeLunas: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: colors.successBg,
  },
  statusBadgeLunasText: { fontSize: 10, fontWeight: "800", color: colors.successText },
});
