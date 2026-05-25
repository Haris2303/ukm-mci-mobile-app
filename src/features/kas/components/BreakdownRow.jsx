import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, spacing } from "../../../theme/theme";

// Warna data viz per kategori — hardcoded by design, bukan semantic token
const CATEGORY_COLORS = {
  iuran:   '#3b82f6',
  donasi:  '#10b981',
  expense: colors.errorAccent,
  total:   colors.brand,
};

export default function BreakdownRow({
  category,
  iconName,
  label,
  value,
  isPositive = true,
  isTotal = false,
}) {
  const color = CATEGORY_COLORS[category] ?? colors.brand;

  return (
    <View style={styles.row}>
      <View style={[styles.iconBox, { backgroundColor: color + "15" }]}>
        <FontAwesome5 name={iconName} size={16} color={color} solid />
      </View>
      <View style={styles.labelBox}>
        <Text style={[styles.label, isTotal && styles.labelTotal]}>{label}</Text>
        {!isTotal && (
          <Text style={styles.sign}>
            {isPositive ? "+ Pemasukan" : "− Pengeluaran"}
          </Text>
        )}
      </View>
      <Text
        style={[
          styles.value,
          { color: isTotal ? colors.brand : isPositive ? colors.successText : colors.errorStrong },
          isTotal && styles.valueTotal,
        ]}
      >
        {!isTotal && (isPositive ? "+ " : "− ")}
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
    padding: spacing[3],
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  labelBox: { flex: 1 },
  label: { fontSize: 13, fontWeight: "700", color: "#475569" },
  labelTotal: { fontWeight: "800", color: "#1e293b" },
  sign: { fontSize: 10, color: "#94a3b8", marginTop: 1 },
  value: { fontSize: 14, fontWeight: "800" },
  valueTotal: { fontSize: 17, fontWeight: "900" },
});
