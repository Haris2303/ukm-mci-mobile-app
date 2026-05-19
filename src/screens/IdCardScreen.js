// src/screens/IdCardScreen.js
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
import { parseAvatar } from "../components/AvatarDisplay";

const CARD_WIDTH = 300;

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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleShare}
          disabled={sharing || loading}
          style={{ padding: 6 }}
        >
          <FontAwesome5
            name={sharing ? "spinner" : "share-alt"}
            size={18}
            color={Platform.OS === "ios" ? "#000" : "#fff"}
            solid
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, sharing, loading]);

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
      } else if (data?.card_url) {
        await Linking.openURL(data.card_url);
      } else {
        Alert.alert(
          "Tidak Tersedia",
          "Sharing tidak tersedia di perangkat ini.",
        );
      }
    } catch {
      if (data?.card_url) {
        await Linking.openURL(data.card_url);
      } else {
        Alert.alert("Gagal", "Tidak dapat membagikan ID Card.");
      }
    } finally {
      setSharing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a4ff5" />
        <Text style={styles.loadingText}>Memuat ID Card...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <FontAwesome5
          name="frown"
          size={48}
          color="#94a3b8"
          style={{ marginBottom: 8 }}
        />
        <Text style={styles.errorTitle}>Gagal Memuat ID Card</Text>
        <Text style={styles.errorMsg}>{error}</Text>
        <TouchableOpacity style={styles.btnRetry} onPress={fetchData}>
          <Text style={styles.btnRetryText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!data) return null;

  const tahun = new Date().getFullYear();
  const inisial = (data.user?.name ?? "A")[0].toUpperCase();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card */}
        <View style={styles.cardShadow}>
          <ViewShot ref={cardRef} options={{ format: "png", quality: 1 }}>
            <IdCard data={data} inisial={inisial} tahun={tahun} />
          </ViewShot>
        </View>

        {/* Share */}
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
              <FontAwesome5 name="share-alt" size={16} color="#fff" solid />
              <Text style={styles.shareBtnText}>Bagikan ID Card</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Info */}
        <View style={styles.infoBox}>
          <FontAwesome5 name="info-circle" size={16} color="#1e40af" solid />
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

// ═══════════════════════════════════════════════════════════
// ID CARD — layout mengikuti show.blade.php
// Mode A: background image dari admin panel (transparent content)
// Mode B: gradient biru (default template)
// ═══════════════════════════════════════════════════════════
function IdCard({ data, inisial, tahun }) {
  const {
    user,
    avatar,
    background_image_url: bgUrl,
    profile_url: profileUrl,
  } = data;
  const hb = !!bgUrl;
  const parsed = parseAvatar(avatar);

  // ── Header ────────────────────────────────────────────────
  const header = (
    <LinearGradient
      colors={
        hb ? ["rgba(0,0,0,0.45)", "rgba(0,0,0,0.08)"] : ["#1a4ff5", "#3671ff"]
      }
      start={{ x: 0, y: 0 }}
      end={hb ? { x: 0, y: 1 } : { x: 1, y: 0 }}
      style={styles.cardHeader}
    >
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>M</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.orgLabel}>Unit Kegiatan Mahasiswa</Text>
        <Text style={styles.orgTitle}>
          MCI — Mahasiswa Creative & Innovation
        </Text>
      </View>
    </LinearGradient>
  );

  // ── Photo — supports emoji, photo upload, and initials ────
  const photoStyle = [styles.photo, hb && styles.photoBg];
  let photoEl;
  if (parsed.type === "photo") {
    photoEl = (
      <Image
        source={{ uri: parsed.url }}
        style={photoStyle}
        resizeMode="cover"
      />
    );
  } else if (parsed.type === "emoji") {
    photoEl = (
      <View style={[photoStyle, { backgroundColor: `#${parsed.bg}` }]}>
        <Text style={styles.emojiAvatar}>{parsed.emoji}</Text>
      </View>
    );
  } else {
    photoEl = (
      <LinearGradient colors={["#1a4ff5", "#3671ff"]} style={photoStyle}>
        <Text style={styles.inisial}>{inisial}</Text>
      </LinearGradient>
    );
  }

  // ── Body content (shared between both modes) ──────────────
  const body = (
    <>
      {/* Foto — centered */}
      <View style={styles.photoWrap}>
        {hb ? <View style={styles.photoShadow}>{photoEl}</View> : photoEl}
      </View>

      {/* Nama + Role + Divisi — centered */}
      <View style={styles.infoSection}>
        <Text
          style={[styles.cardName, hb && styles.cardNameBg]}
          numberOfLines={2}
        >
          {user?.name ?? "—"}
        </Text>

        <View style={[styles.rolePill, hb && styles.rolePillBg]}>
          <Text style={[styles.rolePillText, hb && styles.rolePillTextBg]}>
            {user?.role_label ?? user?.role ?? "Anggota"}
          </Text>
        </View>

        <View style={[styles.divisiRow, hb && styles.divisiRowBg]}>
          <Text style={[styles.divisiLabel, hb && styles.divisiLabelBg]}>
            Divisi
          </Text>
          <Text style={[styles.divisiValue, hb && styles.divisiValueBg]}>
            {user?.divisi ?? "—"}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.cardDivider, hb && styles.cardDividerBg]} />

      {/* QR Code — centered */}
      <View style={styles.qrWrap}>
        <Text style={[styles.scanLabel, hb && styles.scanLabelBg]}>
          Scan untuk verifikasi
        </Text>
        <View style={[styles.qrBox, hb && styles.qrBoxBg]}>
          {profileUrl ? (
            <QRCode
              value={profileUrl}
              size={110}
              backgroundColor="white"
              color="#1e293b"
            />
          ) : (
            <View style={styles.qrEmpty}>
              <Text style={styles.qrEmptyText}>QR</Text>
            </View>
          )}
        </View>
      </View>

      {/* Footer */}
      <View style={[styles.cardFooterWrap, hb && styles.cardFooterWrapBg]}>
        <Text style={[styles.footerText, hb && styles.footerTextBg]}>
          UKM MCI · Kartu Anggota Resmi · {tahun}
        </Text>
      </View>
    </>
  );

  // ── Mode A: background image ───────────────────────────────
  if (hb) {
    return (
      <ImageBackground
        source={{ uri: bgUrl }}
        style={styles.card}
        resizeMode="cover"
        imageStyle={{ borderRadius: 20 }}
      >
        {header}
        {body}
      </ImageBackground>
    );
  }

  // ── Mode B: gradient template ──────────────────────────────
  return (
    <View style={styles.card}>
      {header}
      {body}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════
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

  scrollContent: {
    alignItems: "center",
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // Shadow wrapper — separate from clip layer so shadow isn't clipped
  cardShadow: {
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.11,
    shadowRadius: 20,
    elevation: 6,
  },

  // Clip container (content clipped to rounded corners)
  card: {
    width: CARD_WIDTH,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
  },

  // ── Header ──
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
  },
  logoBox: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  logoText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  orgLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: "rgba(255,255,255,0.75)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  orgTitle: { fontSize: 11, fontWeight: "700", color: "#fff", lineHeight: 15 },

  // ── Photo ──
  photoWrap: { paddingTop: 22, paddingBottom: 14, alignItems: "center" },
  photoShadow: {
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  photo: {
    width: 96,
    height: 96,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: "#1a4ff5",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  photoBg: { borderColor: "#fff" },
  inisial: { color: "#fff", fontSize: 34, fontWeight: "800" },
  emojiAvatar: { fontSize: 42 },

  // ── Info (centered) ──
  infoSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
    gap: 8,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
    lineHeight: 22,
  },
  cardNameBg: { color: "#fff" },

  rolePill: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "#eef5ff",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#bdd8ff",
  },
  rolePillBg: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderColor: "rgba(255,255,255,0.35)",
  },
  rolePillText: { fontSize: 10, fontWeight: "600", color: "#1a4ff5" },
  rolePillTextBg: { color: "#fff" },

  divisiRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f8fafc",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  divisiRowBg: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderColor: "rgba(255,255,255,0.3)",
  },
  divisiLabel: {
    fontSize: 9,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: "#94a3b8",
  },
  divisiLabelBg: { color: "rgba(255,255,255,0.7)" },
  divisiValue: { fontSize: 12, fontWeight: "600", color: "#334155" },
  divisiValueBg: { color: "#fff" },

  // ── Divider ──
  cardDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#e2e8f0",
    marginHorizontal: 20,
  },
  cardDividerBg: {
    backgroundColor: "rgba(255,255,255,0.25)",
    marginHorizontal: 24,
  },

  // ── QR (centered) ──
  qrWrap: { paddingTop: 18, paddingBottom: 20, alignItems: "center", gap: 10 },
  scanLabel: {
    fontSize: 8.5,
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  scanLabelBg: { color: "rgba(255,255,255,0.75)" },
  qrBox: { borderRadius: 8, overflow: "hidden" },
  qrBoxBg: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  qrEmpty: {
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
  },
  qrEmptyText: { fontSize: 20, fontWeight: "800", color: "#cbd5e1" },

  // ── Footer ──
  cardFooterWrap: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#f1f5f9",
  },
  cardFooterWrapBg: { borderTopColor: "rgba(255,255,255,0.2)" },
  footerText: {
    fontSize: 8,
    color: "#cbd5e1",
    textAlign: "center",
    letterSpacing: 0.6,
  },
  footerTextBg: { color: "rgba(255,255,255,0.55)" },

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
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  shareBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },

  // ── Info box ──
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#eff6ff",
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#bfdbfe",
    width: CARD_WIDTH,
  },
  infoText: { flex: 1, fontSize: 12, color: "#1e40af", lineHeight: 18 },
});
