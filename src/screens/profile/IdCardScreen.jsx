// src/screens/IdCardScreen.jsx
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';

import { parseAvatar } from '@components/AvatarDisplay';
import { LoadingState, ErrorState } from '@shared/components';

import { useIdCard } from '@features/profile/hooks/useProfile';

import { colors } from '@theme/colors';

import {
  styles,
  CARD_GRADIENT_BG,
  CARD_GRADIENT_BLUE,
  PHOTO_GRADIENT,
} from './IdCardScreen.styles';

export default function IdCardScreen({ navigation }) {
  const [sharing, setSharing] = useState(false);
  const cardRef = useRef();

  // ── Server state ──────────────────────────────────────────────────────────
  const { data, isLoading, isError, error, refetch } = useIdCard();

  // ── Share ─────────────────────────────────────────────────────────────────
  // Tidak dibungkus useCallback — React Compiler menangani memoization otomatis.
  const handleShare = async () => {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      const uri = await cardRef.current.capture();
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Bagikan ID Card' });
      } else if (data?.card_url) {
        await Linking.openURL(data.card_url);
      } else {
        Alert.alert('Tidak Tersedia', 'Sharing tidak tersedia di perangkat ini.');
      }
    } catch {
      if (data?.card_url) {
        await Linking.openURL(data.card_url);
      } else {
        Alert.alert('Gagal', 'Tidak dapat membagikan ID Card.');
      }
    } finally {
      setSharing(false);
    }
  };

  // ── Header right: tombol share ────────────────────────────────────────────
  // handleShare tidak dimasukkan ke deps: headerRight adalah inline function yang
  // dibuat ulang setiap effect berjalan, sehingga selalu menangkap handleShare terbaru.
  // Effect ini hanya perlu re-run saat tampilan tombol berubah (sharing / isLoading).
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleShare}
          disabled={sharing || isLoading}
          style={{ padding: 6 }}
        >
          <FontAwesome5
            name={sharing ? 'spinner' : 'share-alt'}
            size={18}
            color={Platform.OS === 'ios' ? colors.label : colors.labelOnPrimary}
            solid
          />
        </TouchableOpacity>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, sharing, isLoading]);

  // ── Guard states ──────────────────────────────────────────────────────────
  if (isLoading) return <LoadingState message="Memuat ID Card..." />;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;
  if (!data) return null;

  const tahun = new Date().getFullYear();
  const inisial = (data.user?.name ?? 'A')[0].toUpperCase();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Card */}
        <View style={styles.cardShadow}>
          <ViewShot ref={cardRef} options={{ format: 'png', quality: 1 }}>
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
            <ActivityIndicator color={colors.labelOnPrimary} size="small" />
          ) : (
            <>
              <FontAwesome5 name="share-alt" size={16} color={colors.labelOnPrimary} solid />
              <Text style={styles.shareBtnText}>Bagikan ID Card</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Info */}
        <View style={styles.infoBox}>
          <FontAwesome5 name="info-circle" size={16} color={colors.infoText} solid />
          <Text style={styles.infoText}>
            ID Card ini adalah kartu anggota digital resmi UKM MCI. QR Code dapat di-scan untuk
            verifikasi keanggotaan Anda.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════
// ID CARD — Mode A: background image | Mode B: gradient biru
// ═══════════════════════════════════════════════════════════
function IdCard({ data, inisial, tahun }) {
  const { user, avatar, background_image_url: bgUrl, profile_url: profileUrl } = data;
  const hb = !!bgUrl;
  const parsed = parseAvatar(avatar);

  // ── Header ────────────────────────────────────────────────
  const header = (
    <LinearGradient
      colors={hb ? CARD_GRADIENT_BG : CARD_GRADIENT_BLUE}
      start={{ x: 0, y: 0 }}
      end={hb ? { x: 0, y: 1 } : { x: 1, y: 0 }}
      style={styles.cardHeader}
    >
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>M</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.orgLabel}>Unit Kegiatan Mahasiswa</Text>
        <Text style={styles.orgTitle}>MCI — Mahasiswa Creative &amp; Innovation</Text>
      </View>
    </LinearGradient>
  );

  // ── Photo ─────────────────────────────────────────────────
  const photoStyle = [styles.photo, hb && styles.photoBg];
  let photoEl;
  if (parsed.type === 'photo') {
    photoEl = <Image source={{ uri: parsed.url }} style={photoStyle} resizeMode="cover" />;
  } else if (parsed.type === 'emoji') {
    photoEl = (
      <View style={[photoStyle, { backgroundColor: `#${parsed.bg}` }]}>
        <Text style={styles.emojiAvatar}>{parsed.emoji}</Text>
      </View>
    );
  } else {
    photoEl = (
      <LinearGradient colors={PHOTO_GRADIENT} style={photoStyle}>
        <Text style={styles.inisial}>{inisial}</Text>
      </LinearGradient>
    );
  }

  // ── Body ──────────────────────────────────────────────────
  const body = (
    <>
      <View style={styles.photoWrap}>
        {hb ? <View style={styles.photoShadow}>{photoEl}</View> : photoEl}
      </View>

      <View style={styles.infoSection}>
        <Text style={[styles.cardName, hb && styles.cardNameBg]} numberOfLines={2}>
          {user?.name ?? '—'}
        </Text>

        <View style={[styles.rolePill, hb && styles.rolePillBg]}>
          <Text style={[styles.rolePillText, hb && styles.rolePillTextBg]}>
            {user?.role_label ?? user?.role ?? 'Anggota'}
          </Text>
        </View>

        <View style={[styles.divisiRow, hb && styles.divisiRowBg]}>
          <Text style={[styles.divisiLabel, hb && styles.divisiLabelBg]}>Divisi</Text>
          <Text style={[styles.divisiValue, hb && styles.divisiValueBg]}>
            {user?.divisi ?? '—'}
          </Text>
        </View>
      </View>

      <View style={[styles.cardDivider, hb && styles.cardDividerBg]} />

      <View style={styles.qrWrap}>
        <Text style={[styles.scanLabel, hb && styles.scanLabelBg]}>Scan untuk verifikasi</Text>
        <View style={[styles.qrBox, hb && styles.qrBoxBg]}>
          {profileUrl ? (
            <QRCode value={profileUrl} size={110} backgroundColor="white" color={colors.slate800} />
          ) : (
            <View style={styles.qrEmpty}>
              <Text style={styles.qrEmptyText}>QR</Text>
            </View>
          )}
        </View>
      </View>

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
