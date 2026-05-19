// src/screens/EditAvatarScreen.js
import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AvatarDisplay from "../components/AvatarDisplay";
import {
  getProfile,
  setEmojiAvatar,
  uploadAvatarPhoto,
  useLastPhotoAvatar,
} from "../services/profileApi";

// ── Preset data ───────────────────────────────────────────────
const EMOJI_LIST = [
  "🐶",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
  "🐨",
  "🐯",
  "🦁",
  "🐮",
  "🐸",
  "🐵",
  "🐧",
  "🐦",
  "🦆",
  "🦅",
  "🦉",
  "🦇",
  "🐺",
  "🐗",
  "🐴",
  "🦄",
  "🐝",
  "🐛",
  "🦋",
  "🐌",
  "🐞",
  "🐜",
  "🦟",
  "🦗",
  "🕷️",
  "🦂",
  "🐢",
  "🐍",
  "🦎",
  "🦖",
  "🦕",
  "🐙",
  "🦑",
  "🦐",
];

const BG_COLORS = [
  "ffd5dc",
  "ffdec2",
  "fff3c2",
  "d4f5d4",
  "c2f0ff",
  "d5c2ff",
  "ffc2e8",
  "e8e8e8",
  "1a56db",
  "059669",
  "d97706",
  "7c3aed",
];

export default function EditAvatarScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const res = await getProfile();
          if (active) setProfile(res.data);
        } catch (e) {
          Alert.alert("Error", e.message);
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSave}
          disabled={!pendingAvatar || saving}
          style={
            Platform.OS === "ios" ? { marginLeft: 10 } : { marginRight: 8 }
          }
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <FontAwesome5
              name="save"
              size={20}
              color={
                pendingAvatar
                  ? Platform.OS === "ios"
                    ? "#1e293b"
                    : "#fff"
                  : Platform.OS === "ios"
                    ? "rgba(30,41,59,0.3)"
                    : "rgba(255,255,255,0.35)"
              }
              solid
            />
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, pendingAvatar, saving]);

  // ── Preview avatar ────────────────────────────────────────────
  const previewAvatar = (() => {
    if (!pendingAvatar) return profile?.avatar ?? null;
    if (pendingAvatar.type === "photo") return pendingAvatar.uri;
    if (pendingAvatar.type === "emoji")
      return `emoji:${pendingAvatar.emoji}:${pendingAvatar.bg}`;
    if (pendingAvatar.type === "last_photo")
      return profile?.last_photo_url ? "__last_photo__" : null;
    return null;
  })();

  // For preview we resolve last_photo differently
  const previewAvatarValue = (() => {
    if (pendingAvatar?.type === "last_photo") return profile?.avatar ?? null;
    return previewAvatar;
  })();

  // ── Pick from gallery ─────────────────────────────────────────
  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Izin Diperlukan",
        "Izin galeri diperlukan untuk memilih foto.",
      );
      return;
    }

    if (!profile?.can_upload_photo) {
      const date = profile?.cooldown_selesai
        ? new Date(profile.cooldown_selesai).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "14 hari dari upload terakhir";
      Alert.alert("Cooldown Aktif", `Foto baru dapat diunggah mulai ${date}.`);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      const mimeType = asset.mimeType ?? "image/jpeg";
      setPendingAvatar({ type: "photo", uri: asset.uri, mimeType });
    }
  };

  // ── Pick from camera ──────────────────────────────────────────
  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Izin Diperlukan",
        "Izin kamera diperlukan untuk mengambil foto.",
      );
      return;
    }

    if (!profile?.can_upload_photo) {
      const date = profile?.cooldown_selesai
        ? new Date(profile.cooldown_selesai).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "14 hari dari upload terakhir";
      Alert.alert("Cooldown Aktif", `Foto baru dapat diunggah mulai ${date}.`);
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      const mimeType = asset.mimeType ?? "image/jpeg";
      setPendingAvatar({ type: "photo", uri: asset.uri, mimeType });
    }
  };

  // ── Save ──────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!pendingAvatar) return;
    setSaving(true);
    try {
      if (pendingAvatar.type === "photo") {
        await uploadAvatarPhoto(pendingAvatar.uri, pendingAvatar.mimeType);
      } else if (pendingAvatar.type === "emoji") {
        await setEmojiAvatar(pendingAvatar.emoji, pendingAvatar.bg);
      } else if (pendingAvatar.type === "last_photo") {
        await useLastPhotoAvatar();
      }
      navigation.goBack();
    } catch (e) {
      if (e.kode === "COOLDOWN_AKTIF") {
        const date = e.responseData?.data?.cooldown_selesai
          ? new Date(e.responseData.data.cooldown_selesai).toLocaleDateString(
              "id-ID",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              },
            )
          : "";
        Alert.alert(
          "Cooldown Aktif",
          `Foto baru dapat diunggah mulai ${date}.`,
        );
      } else if (e.kode === "TIDAK_ADA_FOTO_LAMA") {
        Alert.alert(
          "Tidak Ada Foto Lama",
          "Belum ada foto yang pernah diunggah.",
        );
      } else {
        Alert.alert("Gagal Menyimpan", e.message);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a4ff5" />
      </View>
    );
  }

  const showLastPhoto =
    profile?.last_photo_url && profile?.last_photo_url !== profile?.avatar_url;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Preview ───────────────────────────────────── */}
        <View style={styles.previewSection}>
          <AvatarDisplay
            avatar={
              pendingAvatar?.type === "photo"
                ? pendingAvatar.uri
                : pendingAvatar?.type === "emoji"
                  ? `emoji:${pendingAvatar.emoji}:${pendingAvatar.bg}`
                  : pendingAvatar?.type === "last_photo"
                    ? profile?.last_photo_url
                    : profile?.avatar
            }
            name={profile?.name}
            size={100}
            borderRadius={28}
            style={styles.previewAvatar}
          />
          {pendingAvatar && (
            <TouchableOpacity onPress={() => setPendingAvatar(null)}>
              <Text style={styles.resetText}>Reset ke saat ini</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Upload Foto ───────────────────────────────── */}
        <SectionTitle iconName="camera" title="Upload Foto" />
        <View style={styles.photoRow}>
          <PhotoOptionBtn
            iconName="images"
            label="Galeri"
            onPress={pickFromGallery}
            disabled={!profile?.can_upload_photo}
          />
          <PhotoOptionBtn
            iconName="camera"
            label="Kamera"
            onPress={pickFromCamera}
            disabled={!profile?.can_upload_photo}
          />
        </View>
        {!profile?.can_upload_photo && profile?.cooldown_selesai && (
          <View style={styles.cooldownBox}>
            <FontAwesome5 name="clock" size={12} color="#92400e" solid />
            <Text style={styles.cooldownText}>
              Foto baru tersedia mulai{" "}
              {new Date(profile.cooldown_selesai).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>
        )}

        {/* ── Foto Terakhir ─────────────────────────────── */}
        {showLastPhoto && (
          <>
            <SectionTitle iconName="history" title="Foto Terakhir" />
            <TouchableOpacity
              style={[
                styles.lastPhotoBtn,
                pendingAvatar?.type === "last_photo" &&
                  styles.lastPhotoBtnActive,
              ]}
              onPress={() => setPendingAvatar({ type: "last_photo" })}
              activeOpacity={0.8}
            >
              <AvatarDisplay
                avatar={profile.last_photo_url}
                name={profile.name}
                size={56}
                borderRadius={14}
              />
              <View style={styles.lastPhotoInfo}>
                <Text style={styles.lastPhotoLabel}>
                  Gunakan foto sebelumnya
                </Text>
                <Text style={styles.lastPhotoSub}>
                  Tidak ada cooldown untuk opsi ini
                </Text>
              </View>
              {pendingAvatar?.type === "last_photo" && (
                <FontAwesome5
                  name="check-circle"
                  size={20}
                  color="#1a4ff5"
                  solid
                />
              )}
            </TouchableOpacity>
          </>
        )}

        {/* ── Pilih Emoji ───────────────────────────────── */}
        <SectionTitle iconName="smile" title="Pilih Emoji" />
        <View style={styles.emojiGrid}>
          {EMOJI_LIST.map((emoji, idx) => {
            const bg = BG_COLORS[idx % BG_COLORS.length];
            const isActive =
              pendingAvatar?.type === "emoji" &&
              pendingAvatar.emoji === emoji &&
              pendingAvatar.bg === bg;
            return (
              <TouchableOpacity
                key={`emoji-${idx}`}
                style={[styles.emojiCell, isActive && styles.emojiCellActive]}
                onPress={() => setPendingAvatar({ type: "emoji", emoji, bg })}
                activeOpacity={0.75}
              >
                <View
                  style={[styles.emojiBubble, { backgroundColor: `#${bg}` }]}
                >
                  <Text style={styles.emojiChar}>{emoji}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Saving overlay ───────────────────────────────── */}
      {saving && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.savingText}>Menyimpan...</Text>
        </View>
      )}
    </View>
  );
}

function SectionTitle({ iconName, title }) {
  return (
    <View style={styles.sectionTitleRow}>
      <FontAwesome5 name={iconName} size={14} color="#1e293b" solid />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function PhotoOptionBtn({ iconName, label, onPress, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.photoBtn, disabled && styles.photoBtnDisabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <View
        style={[styles.photoBtnIcon, disabled && styles.photoBtnIconDisabled]}
      >
        <FontAwesome5
          name={iconName}
          size={22}
          color={disabled ? "#94a3b8" : "#1a4ff5"}
          solid
        />
      </View>
      <Text
        style={[styles.photoBtnLabel, disabled && styles.photoBtnLabelDisabled]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4ff" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
  },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 0 },

  previewSection: { alignItems: "center", paddingVertical: 24, gap: 10 },
  previewAvatar: {
    borderWidth: 4,
    borderColor: "#1a4ff5",
  },
  resetText: { fontSize: 13, color: "#1a4ff5", fontWeight: "600" },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: { fontSize: 15, fontWeight: "800", color: "#1e293b" },

  photoRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  photoBtn: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    elevation: 2,
  },
  photoBtnDisabled: { borderColor: "#f1f5f9", backgroundColor: "#fafafa" },
  photoBtnIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
  },
  photoBtnIconDisabled: { backgroundColor: "#f8fafc" },
  photoBtnLabel: { fontSize: 14, fontWeight: "700", color: "#1a4ff5" },
  photoBtnLabelDisabled: { color: "#94a3b8" },

  cooldownBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fef3c7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#fcd34d",
  },
  cooldownText: { flex: 1, fontSize: 12, color: "#92400e", fontWeight: "600" },

  lastPhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    elevation: 2,
  },
  lastPhotoBtnActive: { borderColor: "#1a4ff5", backgroundColor: "#eff6ff" },
  lastPhotoInfo: { flex: 1, gap: 2 },
  lastPhotoLabel: { fontSize: 14, fontWeight: "700", color: "#1e293b" },
  lastPhotoSub: { fontSize: 12, color: "#64748b" },

  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  emojiCell: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "transparent",
  },
  emojiCellActive: { borderColor: "#1a4ff5" },
  emojiBubble: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  emojiChar: { fontSize: 24 },

  savingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },
  savingText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
