// src/screens/HomeScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import KasRingkasanCard from "../components/KasRingkasanCard";
import MateriRingkasanCard from "../components/MateriRingkaksanCard";
import ProkerRingkasanCard from "../components/ProkerRingkasanCard";

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert("Keluar", "Anda yakin ingin keluar dari akun?", [
      { text: "Batal", style: "cancel" },
      { text: "Keluar", style: "destructive", onPress: signOut },
    ]);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.name ?? "Anggota"}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity
            style={styles.avatarBox}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.avatarText}>
              {(user?.name ?? "A")[0].toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Anggota Aktif UKM MCI</Text>
        </View>
      </View>

      {/* ── Keuangan ──────────────────────────────────────── */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Keuangan</Text>
          <TouchableOpacity onPress={() => navigation.navigate("E-Kas")}>
            <Text style={styles.seeAll}>Lihat Semua →</Text>
          </TouchableOpacity>
        </View>
        <KasRingkasanCard onPress={() => navigation.navigate("E-Kas")} />
      </View>

      {/* ── Program Kerja ────────────────────────────────── */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Program Kerja</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Proker")}>
            <Text style={[styles.seeAll, { color: "#7c3aed" }]}>
              Lihat Semua →
            </Text>
          </TouchableOpacity>
        </View>
        <ProkerRingkasanCard onPress={() => navigation.navigate("Proker")} />
      </View>

      {/* ── Pembelajaran ─────────────────────────────────── */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Pembelajaran</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Materi")}>
            <Text style={styles.seeAll}>Lihat Semua →</Text>
          </TouchableOpacity>
        </View>
        <MateriRingkasanCard onPress={() => navigation.navigate("Materi")} />
      </View>

      {/* ── Menu Utama ───────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menu Utama</Text>
        <View style={styles.menuGrid}>
          <MenuCard
            iconName="camera"
            title="Scan Presensi"
            desc="Scan QR Code untuk hadir"
            color="#1a56db"
            onPress={() => navigation.navigate("Scan QR")}
          />
          <MenuCard
            iconName="coins"
            title="E-Kas"
            desc="Tagihan & saldo"
            color="#059669"
            onPress={() => navigation.navigate("E-Kas")}
          />
          <MenuCard
            iconName="book"
            title="Materi"
            desc="Distribusi materi"
            color="#059669"
            onPress={() => navigation.navigate("Materi")}
          />
          <MenuCard
            iconName="clipboard-list"
            title="Riwayat"
            desc="Lihat kehadiran Anda"
            color="#059669"
            onPress={() => navigation.navigate("Riwayat")}
          />
        </View>
      </View>

      {/* ── Info Cara Presensi ───────────────────────────── */}
      <View style={styles.section}>
        <View style={styles.infoCard}>
          <View style={styles.infoIconBox}>
            <FontAwesome5 name="lightbulb" size={22} color="#1e40af" solid />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Cara Presensi</Text>
            <Text style={styles.infoDesc}>
              1. Tap menu "Scan QR" di bawah{"\n"}
              2. Arahkan kamera ke QR Code panitia{"\n"}
              3. Tunggu konfirmasi kehadiran Anda
            </Text>
          </View>
        </View>
      </View>

      {/* ── Logout ───────────────────────────────────────── */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
          <FontAwesome5 name="sign-out-alt" size={15} color="#ef4444" />
          <Text style={styles.btnLogoutText}>Keluar dari Akun</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

function MenuCard({ iconName, title, desc, color, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.menuCard, { borderTopColor: color }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.menuIconBox, { backgroundColor: color + "18" }]}>
        <FontAwesome5 name={iconName} size={22} color={color} solid />
      </View>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.menuDesc}>{desc}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4ff",
  },

  header: {
    backgroundColor: "#1a56db",
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  greeting: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4ade80",
  },
  statusText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },

  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  seeAll: {
    fontSize: 13,
    color: "#1a4ff5",
    fontWeight: "600",
  },

  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  menuCard: {
    width: "47%",
    flexGrow: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    borderTopWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  menuIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  menuDesc: {
    fontSize: 12,
    color: "#94a3b8",
    lineHeight: 17,
  },

  infoCard: {
    backgroundColor: "#eff6ff",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    gap: 14,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    alignItems: "flex-start",
  },
  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContent: { flex: 1 },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e40af",
    marginBottom: 6,
  },
  infoDesc: {
    fontSize: 13,
    color: "#3b82f6",
    lineHeight: 22,
  },

  btnLogout: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: "#fecaca",
  },
  btnLogoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ef4444",
  },
});
