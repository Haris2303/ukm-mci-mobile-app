import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, spacing } from "../../../theme/theme";
import EmptyKas from "../components/EmptyKas";
import TunggakanItem from "../components/TunggakanItem";

export default function TunggakanTab({ data }) {
  if (!data || data.jumlah_tunggakan === 0) {
    return (
      <EmptyKas
        iconName="check-circle"
        title="Tidak Ada Tunggakan!"
        desc="Selamat! Semua iuran Anda telah lunas. Terima kasih atas ketertiban Anda dalam membayar iuran."
        bgColor={colors.successBg}
        accentColor={colors.successIconBg}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryIconBox}>
          <FontAwesome5 name="chart-bar" size={24} color={colors.warningText} solid />
        </View>
        <View style={styles.summaryContent}>
          <Text style={styles.summaryLabel}>Total Tunggakan Anda</Text>
          <Text style={styles.summaryValue}>{data.total_format}</Text>
          <Text style={styles.summaryMeta}>
            {data.jumlah_tunggakan} bulan belum dibayar
          </Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <FontAwesome5 name="lightbulb" size={16} color={colors.infoText} solid />
        <Text style={styles.infoText}>
          Hubungi <Text style={{ fontWeight: "700" }}>Bendahara UKM</Text> untuk
          melakukan pembayaran tunai. Status akan otomatis update setelah
          bendahara mencatat pembayaran Anda.
        </Text>
      </View>

      <Text style={styles.sectionLabel}>Daftar Tagihan</Text>

      {data.tagihan.map((item, idx) => (
        <TunggakanItem key={item.id ?? `tagihan-${idx}`} item={item} />
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
  summaryIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.warningIcon,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryContent: { flex: 1 },
  summaryLabel: { fontSize: 12, color: colors.warningText, fontWeight: "600" },
  summaryValue: { fontSize: 22, fontWeight: "900", color: colors.warningText, marginTop: 2 },
  summaryMeta: { fontSize: 11, color: colors.warningMuted, marginTop: 2 },
  infoBox: {
    backgroundColor: colors.infoBg,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.infoBorder,
  },
  infoText: { flex: 1, fontSize: 12, color: colors.infoText, lineHeight: 18 },
});
