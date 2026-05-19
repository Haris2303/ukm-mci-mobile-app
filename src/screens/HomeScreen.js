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
import AvatarDisplay from "../components/AvatarDisplay";
import KasRingkasanCard from "../components/KasRingkasanCard";
import MateriRingkasanCard from "../components/MateriRingkaksanCard";
import ProkerRingkasanCard from "../components/ProkerRingkasanCard";

export default function HomeScreen({ navigation }) {
  const { user, avatar, signOut } = useAuth();

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
            onPress={() => navigation.navigate("Profile")}
            activeOpacity={0.85}
            style={styles.avatarWrap}
          >
            <AvatarDisplay
              avatar={avatar}
              name={user?.name}
              size={48}
              borderRadius={14}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Anggota Aktif UKM MCI</Text>
        </View>
      </View>

      {/* ── Keuangan ──────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Keuangan</Text>
        <KasRingkasanCard onPress={() => navigation.navigate("E-Kas")} />
      </View>

      {/* ── Menu Utama ───────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menu Utama</Text>
        <View style={styles.menuGrid}>
          <MenuItem iconName="camera" label="Presensi" color="#1a56db" onPress={() => navigation.navigate("Scan QR")} />
          <MenuItem iconName="coins" label="E-Kas" color="#059669" onPress={() => navigation.navigate("E-Kas")} />
          <MenuItem iconName="vote-yea" label="E-Voting" color="#2563eb" onPress={() => navigation.navigate("E-Voting")} />
          <MenuItem iconName="tasks" label="Proker" color="#7c3aed" onPress={() => navigation.navigate("Proker")} />
          <MenuItem iconName="book-open" label="Materi" color="#d97706" onPress={() => navigation.navigate("Materi")} />
          <MenuItem iconName="id-card" label="ID Card" color="#0891b2" onPress={() => navigation.navigate("IdCard")} />
          <MenuItem iconName="clipboard-list" label="Riwayat" color="#475569" onPress={() => navigation.navigate("Riwayat")} />
          <MenuItem iconName="user-circle" label="Profil" color="#be185d" onPress={() => navigation.navigate("Profile")} />
        </View>
      </View>

      {/* ── Pembelajaran ─────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pembelajaran</Text>
        <MateriRingkasanCard onPress={() => navigation.navigate("Materi")} />
      </View>

      {/* ── Program Kerja ────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Program Kerja</Text>
        <ProkerRingkasanCard onPress={() => navigation.navigate("Proker")} />
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

function MenuItem({ iconName, label, color, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.menuIconCircle, { backgroundColor: color }]}>
        <FontAwesome5 name={iconName} size={22} color="#fff" solid />
      </View>
      <Text style={styles.menuItemLabel}>{label}</Text>
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
  avatarWrap: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 14,
  },

  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  menuItem: {
    width: "25%",
    alignItems: "center",
    paddingVertical: 12,
    gap: 8,
  },
  menuIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  menuItemLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
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
