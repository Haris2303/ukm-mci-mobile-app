// src/screens/ProfileScreen.js
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { getMyIdCard } from "../services/idCardApi";
import { getProfile } from "../services/profileApi";
import AvatarDisplay from "../components/AvatarDisplay";

export default function ProfileScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [idCard, setIdCard] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [idCardRes, profileRes] = await Promise.all([
        getMyIdCard(),
        getProfile(),
      ]);
      setIdCard(idCardRes);
      setProfile(profileRes.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handleLogout = () => {
    Alert.alert("Keluar", "Anda yakin ingin keluar dari akun?", [
      { text: "Batal", style: "cancel" },
      { text: "Keluar", style: "destructive", onPress: signOut },
    ]);
  };

  const profileUser = profile ?? idCard?.user ?? user;
  const inisial = (profileUser?.name ?? "A")[0].toUpperCase();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Avatar + Nama ──────────────────────────────── */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            onPress={() => navigation.navigate("EditAvatar")}
            activeOpacity={0.85}
          >
            <View style={styles.avatarWrapper}>
              <AvatarDisplay
                avatar={profile?.avatar ?? null}
                name={profileUser?.name}
                size={96}
                borderRadius={20}
                style={styles.avatarBorder}
              />
              <View style={styles.editBadge}>
                <FontAwesome5 name="camera" size={10} color="#fff" solid />
              </View>
            </View>
          </TouchableOpacity>

          <Text style={styles.profileName}>{profileUser?.name ?? "—"}</Text>
          <Text style={styles.profileEmail}>{profileUser?.email ?? "—"}</Text>

          {/* Member ID badge */}
          {idCard?.member_id && (
            <View style={styles.memberIdBadge}>
              <Text style={styles.memberIdText}>{idCard.member_id}</Text>
            </View>
          )}

          {/* Role badge */}
          {profileUser?.role_label && (
            <View style={styles.roleBadge}>
              <View style={styles.roleDot} />
              <Text style={styles.roleBadgeText}>{profileUser.role_label}</Text>
            </View>
          )}
        </View>

        {/* ── Edit Foto Button ───────────────────────────── */}
        <TouchableOpacity
          style={styles.editAvatarBtn}
          onPress={() => navigation.navigate("EditAvatar")}
          activeOpacity={0.85}
        >
          <View style={styles.editAvatarBtnLeft}>
            <View style={styles.editAvatarIconBox}>
              <FontAwesome5 name="user-edit" size={18} color="#1a4ff5" solid />
            </View>
            <Text style={styles.editAvatarBtnText}>Edit Foto Profil</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={14} color="#94a3b8" />
        </TouchableOpacity>

        {/* ── Ubah Password Button ──────────────────────── */}
        <TouchableOpacity
          style={styles.editAvatarBtn}
          onPress={() => navigation.navigate("EditPassword")}
          activeOpacity={0.85}
        >
          <View style={styles.editAvatarBtnLeft}>
            <View style={[styles.editAvatarIconBox, { backgroundColor: "#fef3c7" }]}>
              <FontAwesome5 name="lock" size={18} color="#d97706" solid />
            </View>
            <Text style={styles.editAvatarBtnText}>Ubah Password</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={14} color="#94a3b8" />
        </TouchableOpacity>

        {/* ── ID Card Button ─────────────────────────────── */}
        <TouchableOpacity
          style={styles.idCardBtn}
          onPress={() => navigation.navigate("IdCard")}
          activeOpacity={0.88}
        >
          <LinearGradient
            colors={["#1a4ff5", "#3671ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.idCardBtnGradient}
          >
            <View style={styles.idCardBtnLeft}>
              <View style={styles.idCardIconBox}>
                <FontAwesome5 name="id-card" size={22} color="#fff" solid />
              </View>
              <View>
                <Text style={styles.idCardBtnTitle}>ID Card Saya</Text>
                <Text style={styles.idCardBtnSub}>
                  {idCard?.member_id
                    ? `Lihat kartu anggota · ${idCard.member_id}`
                    : "Lihat kartu anggota digital"}
                </Text>
              </View>
            </View>
            <FontAwesome5 name="chevron-right" size={18} color="rgba(255,255,255,0.6)" />
          </LinearGradient>
        </TouchableOpacity>

        {/* ── Biodata Section ─────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Informasi Pribadi</Text>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#1a4ff5" />
            <Text style={styles.loadingSmall}>Memuat data...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorBox}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <FontAwesome5 name="exclamation-triangle" size={13} color="#92400e" solid />
              <Text style={styles.errorSmall}>{error}</Text>
            </View>
            <TouchableOpacity onPress={fetchData}>
              <Text style={styles.retrySmall}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.bioCard}>
            <BioRow iconName="user" label="Nama Lengkap" value={profileUser?.name} />
            <View style={styles.bioDivider} />
            <BioRow iconName="envelope" label="Email" value={profileUser?.email} />
            <View style={styles.bioDivider} />
            <BioRow iconName="mobile-alt" label="No. HP" value={profileUser?.no_hp} />
            <View style={styles.bioDivider} />
            <BioRow iconName="users" label="Divisi" value={profileUser?.divisi} />
            <View style={styles.bioDivider} />
            <BioRow iconName="tag" label="Role" value={profileUser?.role_label ?? profileUser?.role} />
            {idCard?.member_id && (
              <>
                <View style={styles.bioDivider} />
                <BioRow iconName="id-badge" label="Member ID" value={idCard.member_id} />
              </>
            )}
          </View>
        )}

        {/* ── Logout ──────────────────────────────────────── */}
        <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
          <FontAwesome5 name="sign-out-alt" size={15} color="#ef4444" />
          <Text style={styles.btnLogoutText}>Keluar dari Akun</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function BioRow({ iconName, label, value }) {
  return (
    <View style={styles.bioRow}>
      <View style={styles.bioIconBox}>
        <FontAwesome5 name={iconName} size={16} color="#94a3b8" solid />
      </View>
      <View style={styles.bioContent}>
        <Text style={styles.bioLabel}>{label}</Text>
        <Text style={styles.bioValue}>{value ?? "—"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4ff" },

  scrollContent: { paddingHorizontal: 20, paddingTop: 28 },

  avatarSection: { alignItems: "center", gap: 6, marginBottom: 20 },
  avatarWrapper: { position: "relative", marginBottom: 8 },
  avatarBorder: {
    borderWidth: 4,
    borderColor: "#1a4ff5",
  },
  editBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#1a4ff5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#f0f4ff",
  },
  profileName: { fontSize: 22, fontWeight: "800", color: "#0f172a", textAlign: "center" },
  profileEmail: { fontSize: 13, color: "#64748b", marginTop: 2 },
  memberIdBadge: {
    backgroundColor: "#1a4ff5",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 6,
  },
  memberIdText: { color: "#fff", fontSize: 12, fontWeight: "800", letterSpacing: 1 },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#86efac",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 4,
  },
  roleDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#22c55e" },
  roleBadgeText: { fontSize: 12, fontWeight: "600", color: "#15803d" },

  editAvatarBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#dbeafe",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    elevation: 2,
  },
  editAvatarBtnLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  editAvatarIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
  },
  editAvatarBtnText: { fontSize: 15, fontWeight: "700", color: "#1e293b" },

  idCardBtn: {
    marginBottom: 24,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#1a4ff5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 6,
  },
  idCardBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
  },
  idCardBtnLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
  idCardIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  idCardBtnTitle: { fontSize: 16, fontWeight: "800", color: "#fff" },
  idCardBtnSub: { fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 2 },

  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: "800", color: "#1e293b" },

  loadingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
  },
  loadingSmall: { fontSize: 13, color: "#94a3b8" },
  errorBox: {
    backgroundColor: "#fef3c7",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#fcd34d",
  },
  errorSmall: { fontSize: 13, color: "#92400e" },
  retrySmall: { fontSize: 13, fontWeight: "700", color: "#1a4ff5" },

  bioCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 6,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  bioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  bioIconBox: { width: 28, alignItems: "center", justifyContent: "center" },
  bioContent: { flex: 1 },
  bioLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  bioValue: { fontSize: 14, fontWeight: "600", color: "#1e293b", marginTop: 2 },
  bioDivider: { height: 1, backgroundColor: "#f1f5f9", marginHorizontal: 14 },

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
  btnLogoutText: { fontSize: 15, fontWeight: "600", color: "#ef4444" },
});
