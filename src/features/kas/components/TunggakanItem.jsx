import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, spacing, shadow, radius } from "../../../theme/theme";

export default function TunggakanItem({ item }) {
  return (
    <View style={styles.card}>
      <View style={styles.accent} />
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.periode}>{item.bulan_tagihan_format}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Belum Dibayar</Text>
          </View>
        </View>
        <Text style={styles.nominal}>{item.nominal_format}</Text>
        {item.catatan && (
          <View style={styles.catatanRow}>
            <FontAwesome5 name="comment-alt" size={11} color="#64748b" solid />
            <Text style={styles.catatan} numberOfLines={2}>
              {item.catatan}
            </Text>
          </View>
        )}
        <View style={styles.metaRow}>
          <FontAwesome5 name="calendar-alt" size={11} color="#94a3b8" solid />
          <Text style={styles.meta}>Ditagihkan: {item.dibuat_pada}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: "hidden",
    ...shadow.xs,
  },
  accent: { width: 4, backgroundColor: colors.warningIcon },
  body: { flex: 1, padding: 14, gap: 6 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  periode: { fontSize: 14, fontWeight: "800", color: "#1e293b" },
  nominal: { fontSize: 18, fontWeight: "900", color: colors.warningText },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  catatanRow: { flexDirection: "row", alignItems: "flex-start", gap: 5 },
  catatan: { flex: 1, fontSize: 12, color: "#64748b", fontStyle: "italic" },
  meta: { fontSize: 11, color: "#94a3b8" },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: radius.md,
    backgroundColor: colors.warningBg,
  },
  badgeText: { fontSize: 10, fontWeight: "800", color: colors.warningText },
});
