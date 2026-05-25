import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { spacing, radius } from "../../../theme/theme";

export default function EmptyKas({ iconName, title, desc, bgColor, accentColor }) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bgColor, borderColor: accentColor + "40" },
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: accentColor + "20" }]}>
        <FontAwesome5 name={iconName} size={32} color={accentColor} solid />
      </View>
      <Text style={[styles.title, { color: accentColor }]}>{title}</Text>
      <Text style={styles.desc}>{desc}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    padding: spacing[8],
    alignItems: "center",
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: "dashed",
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "800" },
  desc: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 19,
  },
});
