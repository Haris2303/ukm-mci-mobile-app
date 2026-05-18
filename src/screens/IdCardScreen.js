// src/screens/IdCardScreen.js
// Halaman ID Card digital anggota UKM MCI
// Dual mode: background image (Mode A) atau gradient template (Mode B)

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { FontAwesome5 } from "@expo/vector-icons";
import { getMyIdCard } from "../services/idCardApi";

export default function IdCardScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sharing, setSharing] = useState(false);
  const cardRef = useRef();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyIdCard();
      setData(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Share: capture card → share ─────────────────────────────
  const handleShare = async () => {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      const uri = await cardRef.current.capture();
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: "Bagikan ID Card",
        });
      } else {
        // Fallback: buka card_url di browser
        if (data?.card_url) {
          await Linking.openURL(data.card_url);
        } else {
          Alert.alert("Tidak Tersedia", "Sharing tidak tersedia di perangkat ini.");
        }
      }
    } catch (e) {
      // Fallback: buka di browser
      if (data?.card_url) {
        await Linking.openURL(data.card_url);
      } else {
        Alert.alert("Gagal", "Tidak dapat membagikan ID Card.");
      }
    } finally {
      setSharing(false);
    }
  };

  // ── Loading ─────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a4ff5" />
        <Text style={styles.loadingText}>Memuat ID Card...</Text>
      </View>
    );
  }

  // ── Error ───────────────────────────────────────────────────
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>😕</Text>
        <Text style={styles.errorTitle}>Gagal Memuat ID Card</Text>
        <Text style={styles.errorMsg}>{error}</Text>
        <TouchableOpacity style={styles.btnRetry} onPress={fetchData}>
          <Text style={styles.btnRetryText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!data) return null;

  const { user, member_id, foto_url, background_image_url, profile_url } = data;
  const hasBackground = !!background_image_url;
  const tahun = new Date().getFullYear();
  const inisial = (user?.name ?? "A")[0].toUpperCase();

  return (
    <View style={styles.container}>
      {/* ── Header ──────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="chevron-left" size={16} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ID Card Saya</Text>
        <TouchableOpacity
          style={styles.shareHeaderBtn}
          onPress={handleShare}
          disabled={sharing}
        >
          <FontAwesome5 name={sharing ? "spinner" : "share-alt"} size={18} color="#fff" solid />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Card ────────────────────────────────────────── */}
        <ViewShot
          ref={cardRef}
          options={{ format: "png", quality: 1 }}
          style={styles.cardShotWrapper}
        >
          {hasBackground ? (
            <CardWithBackground
              backgroundUrl={background_image_url}
              user={user}
              memberId={member_id}
              fotoUrl={foto_url}
              profileUrl={profile_url}
              inisial={inisial}
              tahun={tahun}
            />
          ) : (
            <CardWithGradient
              user={user}
              memberId={member_id}
              fotoUrl={foto_url}
              profileUrl={profile_url}
              inisial={inisial}
              tahun={tahun}
            />
          )}
        </ViewShot>

        {/* ── Share Button ────────────────────────────────── */}
        <TouchableOpacity
          style={styles.shareBtn}
          onPress={handleShare}
          disabled={sharing}
          activeOpacity={0.85}
        >
          {sharing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Text style={styles.shareBtnIcon}>📤</Text>
              <Text style={styles.shareBtnText}>Bagikan ID Card</Text>
            </>
          )}
        </TouchableOpacity>

        {/* ── Info ────────────────────────────────────────── */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            ID Card ini adalah kartu anggota digital resmi UKM MCI. QR Code
            dapat di-scan untuk verifikasi keanggotaan Anda.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════
// MODE A — Card dengan Background Image
// ═══════════════════════════════════════════════════════════════
function CardWithBackground({
  backgroundUrl,
  user,
  memberId,
  fotoUrl,
  profileUrl,
  inisial,
  tahun,
}) {
  return (
    <View style={styles.card}>
      <ImageBackground
        source={{ uri: backgroundUrl }}
        style={styles.cardBg}
        resizeMode="cover"
        imageStyle={{ borderRadius: 16 }}
      >
        {/* Header overlay */}
        <View style={styles.cardHeaderOverlay}>
          <CardHeaderContent />
        </View>

        {/* Body panel */}
        <View style={styles.cardBodyBg}>
          <CardBody
            user={user}
            memberId={memberId}
            fotoUrl={fotoUrl}
            profileUrl={profileUrl}
            inisial={inisial}
            tahun={tahun}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════
// MODE B — Card dengan Gradient Template
// ═══════════════════════════════════════════════════════════════
function CardWithGradient({
  user,
  memberId,
  fotoUrl,
  profileUrl,
  inisial,
  tahun,
}) {
  return (
    <View style={styles.card}>
      {/* Gradient header */}
      <LinearGradient
        colors={["#1a4ff5", "#3671ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardHeaderGradient}
      >
        <CardHeaderContent />
      </LinearGradient>

      {/* Body */}
      <View style={styles.cardBodyGradient}>
        <CardBody
          user={user}
          memberId={memberId}
          fotoUrl={fotoUrl}
          profileUrl={profileUrl}
          inisial={inisial}
          tahun={tahun}
        />
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════

function CardHeaderContent() {
  return (
    <View style={styles.headerRow}>
      <View style={styles.logoCircle}>
        <Text style={styles.logoText}>M</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.orgName}>Unit Kegiatan Mahasiswa</Text>
        <Text style={styles.orgFull}>MCI — Mahasiswa Creative & Innovation</Text>
      </View>
    </View>
  );
}

function CardBody({ user, memberId, fotoUrl, profileUrl, inisial, tahun }) {
  return (
    <View style={styles.bodyContent}>
      {/* ── Foto + Info utama ─────────────────────── */}
      <View style={styles.profileRow}>
        {fotoUrl ? (
          <Image
            source={{ uri: fotoUrl }}
            style={styles.profilePhoto}
            resizeMode="cover"
          />
        ) : (
          <LinearGradient
            colors={["#1a4ff5", "#3671ff"]}
            style={styles.profilePlaceholder}
          >
            <Text style={styles.profileInisial}>{inisial}</Text>
          </LinearGradient>
        )}

        <View style={styles.profileInfo}>
          <Text style={styles.profileName} numberOfLines={2}>
            {user?.name ?? "—"}
          </Text>
          <Text style={styles.memberId}>{memberId}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              {user?.role_label ?? user?.role ?? "Anggota"}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Data fields ──────────────────────────── */}
      <View style={styles.fieldsGrid}>
        <View style={styles.fieldHalf}>
          <Text style={styles.fieldLabel}>DIVISI</Text>
          <Text style={styles.fieldValue}>{user?.divisi ?? "—"}</Text>
        </View>
        <View style={styles.fieldHalf}>
          <Text style={styles.fieldLabel}>NO. HP</Text>
          <Text style={styles.fieldValue}>{user?.no_hp ?? "—"}</Text>
        </View>
        <View style={styles.fieldFull}>
          <Text style={styles.fieldLabel}>EMAIL</Text>
          <Text style={styles.fieldValue} numberOfLines={1}>
            {user?.email ?? "—"}
          </Text>
        </View>
      </View>

      {/* ── QR Code ──────────────────────────────── */}
      <View style={styles.qrSection}>
        <View style={styles.qrBox}>
          {profileUrl ? (
            <QRCode
              value={profileUrl}
              size={90}
              backgroundColor="white"
              color="#1a4ff5"
            />
          ) : (
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrPlaceholderText}>QR</Text>
            </View>
          )}
        </View>
        <View style={styles.qrInfo}>
          <Text style={styles.qrScanLabel}>SCAN UNTUK{"\n"}VERIFIKASI</Text>
          <Text style={styles.qrDesc}>
            Arahkan kamera ke QR Code ini untuk memverifikasi keanggotaan
          </Text>
        </View>
      </View>

      {/* ── Footer ───────────────────────────────── */}
      <Text style={styles.cardFooter}>
        UKM MCI · Kartu Anggota Resmi · {tahun}
      </Text>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════
const CARD_WIDTH = 320;
const CARD_HEIGHT = CARD_WIDTH * (5 / 3); // rasio 3:5

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4ff" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
    padding: 32,
    backgroundColor: "#f0f4ff",
  },
  loadingText: { color: "#94a3b8", fontSize: 14 },
  errorIcon: { fontSize: 48 },
  errorTitle: { fontSize: 18, fontWeight: "800", color: "#1e293b" },
  errorMsg: { fontSize: 14, color: "#64748b", textAlign: "center" },
  btnRetry: {
    backgroundColor: "#1a4ff5",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  btnRetryText: { color: "#fff", fontWeight: "700" },

  // ── Screen Header ──
  header: {
    backgroundColor: "#1a4ff5",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 19,
    fontWeight: "800",
    color: "#fff",
  },
  shareHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  scrollContent: {
    alignItems: "center",
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // ── Card wrapper ──
  cardShotWrapper: {
    borderRadius: 16,
    overflow: "hidden",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#1a4ff5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
  },

  // ── Mode A: Background ──
  cardBg: {
    flex: 1,
    borderRadius: 16,
  },
  cardHeaderOverlay: {
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingTop: 20,
    paddingBottom: 14,
    paddingHorizontal: 18,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardBodyBg: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -8,
    paddingTop: 4,
  },

  // ── Mode B: Gradient ──
  cardHeaderGradient: {
    paddingTop: 20,
    paddingBottom: 14,
    paddingHorizontal: 18,
  },
  cardBodyGradient: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 4,
  },

  // ── Card Header content ──
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },
  orgName: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  orgFull: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 1,
  },

  // ── Card Body content ──
  bodyContent: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
    justifyContent: "space-between",
  },

  // Profile row
  profileRow: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#1a4ff5",
  },
  profilePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#1a4ff5",
  },
  profileInisial: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  profileInfo: {
    flex: 1,
    paddingTop: 2,
    gap: 4,
  },
  profileName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: 20,
  },
  memberId: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1a4ff5",
    letterSpacing: 1,
  },
  roleBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#eef5ff",
    borderWidth: 1,
    borderColor: "#bdd8ff",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 2,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1a4ff5",
  },

  // Fields grid
  fieldsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  fieldHalf: {
    width: "47%",
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  fieldFull: {
    width: "100%",
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  fieldLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1e293b",
  },

  // QR section
  qrSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  qrBox: {
    padding: 6,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  qrPlaceholder: {
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
  },
  qrPlaceholderText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#cbd5e1",
  },
  qrInfo: {
    flex: 1,
    gap: 4,
  },
  qrScanLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1a4ff5",
    letterSpacing: 0.5,
    lineHeight: 15,
  },
  qrDesc: {
    fontSize: 10,
    color: "#94a3b8",
    lineHeight: 14,
  },

  // Footer
  cardFooter: {
    fontSize: 9,
    color: "#cbd5e1",
    textAlign: "center",
    marginTop: 8,
  },

  // ── Share button ──
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a4ff5",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 28,
    gap: 10,
    marginTop: 24,
    width: CARD_WIDTH,
    shadowColor: "#1a4ff5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  shareBtnIcon: { fontSize: 18 },
  shareBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },

  // ── Info box ──
  infoBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#eff6ff",
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    width: CARD_WIDTH,
  },
  infoIcon: { fontSize: 18 },
  infoText: { flex: 1, fontSize: 12, color: "#1e40af", lineHeight: 18 },
});
