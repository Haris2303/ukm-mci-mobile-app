// src/screens/EditAvatarScreen.jsx
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AvatarDisplay from '@components/AvatarDisplay';
import { LoadingState } from '@shared/components';

import { useProfile, useUpdateAvatar } from '@features/profile/hooks/useProfile';

import { colors } from '@theme/colors';

import { styles } from './EditAvatarScreen.styles';

// ── Preset data ───────────────────────────────────────────────
const EMOJI_LIST = [
  '🐶',
  '🐱',
  '🐭',
  '🐹',
  '🐰',
  '🦊',
  '🐻',
  '🐼',
  '🐨',
  '🐯',
  '🦁',
  '🐮',
  '🐸',
  '🐵',
  '🐧',
  '🐦',
  '🦆',
  '🦅',
  '🦉',
  '🦇',
  '🐺',
  '🐗',
  '🐴',
  '🦄',
  '🐝',
  '🐛',
  '🦋',
  '🐌',
  '🐞',
  '🐜',
  '🦟',
  '🦗',
  '🕷️',
  '🦂',
  '🐢',
  '🐍',
  '🦎',
  '🦖',
  '🦕',
  '🐙',
  '🦑',
  '🦐',
];

const BG_COLORS = [
  'ffd5dc',
  'ffdec2',
  'fff3c2',
  'd4f5d4',
  'c2f0ff',
  'd5c2ff',
  'ffc2e8',
  'e8e8e8',
  '1a56db',
  '059669',
  'd97706',
  '7c3aed',
];

export default function EditAvatarScreen({ navigation }) {
  const [pendingAvatar, setPendingAvatar] = useState(null);

  // ── Server state ──────────────────────────────────────────────────────────
  const { data: profile, isLoading } = useProfile();

  // ── Mutation ──────────────────────────────────────────────────────────────
  const { mutate: saveAvatar, isPending } = useUpdateAvatar();

  // ── Header right: tombol Save ─────────────────────────────────────────────
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSave}
          disabled={!pendingAvatar || isPending}
          style={Platform.OS === 'ios' ? { marginLeft: 10 } : { marginRight: 8 }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {isPending ? (
            <ActivityIndicator size="small" color={colors.labelOnPrimary} />
          ) : (
            <FontAwesome5
              name="save"
              size={20}
              color={
                pendingAvatar
                  ? Platform.OS === 'ios'
                    ? colors.slate800
                    : colors.labelOnPrimary
                  : Platform.OS === 'ios'
                    ? colors.slate800Alpha30
                    : colors.whiteAlpha35
              }
              solid
            />
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, pendingAvatar, isPending, handleSave]);

  // ── Pick from gallery ─────────────────────────────────────────────────────
  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Diperlukan', 'Izin galeri diperlukan untuk memilih foto.');
      return;
    }

    if (!profile?.can_upload_photo) {
      const date = profile?.cooldown_selesai
        ? new Date(profile.cooldown_selesai).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : '14 hari dari upload terakhir';
      Alert.alert('Cooldown Aktif', `Foto baru dapat diunggah mulai ${date}.`);
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
      setPendingAvatar({ type: 'photo', uri: asset.uri, mimeType: asset.mimeType ?? 'image/jpeg' });
    }
  };

  // ── Pick from camera ──────────────────────────────────────────────────────
  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Diperlukan', 'Izin kamera diperlukan untuk mengambil foto.');
      return;
    }

    if (!profile?.can_upload_photo) {
      const date = profile?.cooldown_selesai
        ? new Date(profile.cooldown_selesai).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : '14 hari dari upload terakhir';
      Alert.alert('Cooldown Aktif', `Foto baru dapat diunggah mulai ${date}.`);
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      setPendingAvatar({ type: 'photo', uri: asset.uri, mimeType: asset.mimeType ?? 'image/jpeg' });
    }
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    if (!pendingAvatar) return;
    saveAvatar(pendingAvatar, {
      onSuccess: () => navigation.goBack(),
      onError: (e) => {
        if (e.kode === 'COOLDOWN_AKTIF') {
          const date = e.responseData?.data?.cooldown_selesai
            ? new Date(e.responseData.data.cooldown_selesai).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : '';
          Alert.alert('Cooldown Aktif', `Foto baru dapat diunggah mulai ${date}.`);
        } else if (e.kode === 'TIDAK_ADA_FOTO_LAMA') {
          Alert.alert('Tidak Ada Foto Lama', 'Belum ada foto yang pernah diunggah.');
        } else {
          Alert.alert('Gagal Menyimpan', e.message);
        }
      },
    });
  }, [pendingAvatar, saveAvatar, navigation]);

  // ── Guard states ──────────────────────────────────────────────────────────
  if (isLoading) return <LoadingState message="Memuat profil..." />;

  const showLastPhoto = profile?.last_photo_url && profile?.last_photo_url !== profile?.avatar_url;

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
              pendingAvatar?.type === 'photo'
                ? pendingAvatar.uri
                : pendingAvatar?.type === 'emoji'
                  ? `emoji:${pendingAvatar.emoji}:${pendingAvatar.bg}`
                  : pendingAvatar?.type === 'last_photo'
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
            <FontAwesome5 name="clock" size={12} color={colors.warningText} solid />
            <Text style={styles.cooldownText}>
              Foto baru tersedia mulai{' '}
              {new Date(profile.cooldown_selesai).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
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
                pendingAvatar?.type === 'last_photo' && styles.lastPhotoBtnActive,
              ]}
              onPress={() => setPendingAvatar({ type: 'last_photo' })}
              activeOpacity={0.8}
            >
              <AvatarDisplay
                avatar={profile.last_photo_url}
                name={profile.name}
                size={56}
                borderRadius={14}
              />
              <View style={styles.lastPhotoInfo}>
                <Text style={styles.lastPhotoLabel}>Gunakan foto sebelumnya</Text>
                <Text style={styles.lastPhotoSub}>Tidak ada cooldown untuk opsi ini</Text>
              </View>
              {pendingAvatar?.type === 'last_photo' && (
                <FontAwesome5 name="check-circle" size={20} color={colors.brand} solid />
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
              pendingAvatar?.type === 'emoji' &&
              pendingAvatar.emoji === emoji &&
              pendingAvatar.bg === bg;
            return (
              <TouchableOpacity
                key={`emoji-${idx}`}
                style={[styles.emojiCell, isActive && styles.emojiCellActive]}
                onPress={() => setPendingAvatar({ type: 'emoji', emoji, bg })}
                activeOpacity={0.75}
              >
                <View style={[styles.emojiBubble, { backgroundColor: `#${bg}` }]}>
                  <Text style={styles.emojiChar}>{emoji}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Saving overlay ───────────────────────────────── */}
      {isPending && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="large" color={colors.labelOnPrimary} />
          <Text style={styles.savingText}>Menyimpan...</Text>
        </View>
      )}
    </View>
  );
}

function SectionTitle({ iconName, title }) {
  return (
    <View style={styles.sectionTitleRow}>
      <FontAwesome5 name={iconName} size={14} color={colors.slate800} solid />
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
      <View style={[styles.photoBtnIcon, disabled && styles.photoBtnIconDisabled]}>
        <FontAwesome5
          name={iconName}
          size={22}
          color={disabled ? colors.slate400 : colors.brand}
          solid
        />
      </View>
      <Text style={[styles.photoBtnLabel, disabled && styles.photoBtnLabelDisabled]}>{label}</Text>
    </TouchableOpacity>
  );
}
