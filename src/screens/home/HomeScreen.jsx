import { FontAwesome5 } from '@expo/vector-icons';
import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';

import AvatarDisplay from '@components/AvatarDisplay';
import MateriRingkasanCard from '@components/MateriRingkaksanCard';
import ProkerRingkasanCard from '@components/ProkerRingkasanCard';
import { useAuth } from '@context/AuthContext';

import KasRingkasanCard from '@features/kas/components/KasRingkasanCard';

import { colors } from '@theme/colors';

import { styles, MENU_ICON_COLORS } from './HomeScreen.styles';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return 'Selamat Pagi';
  if (hour < 15) return 'Selamat Siang';
  if (hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}

export default function HomeScreen({ navigation }) {
  const { user, avatar, signOut } = useAuth();

  const handleLogout = useCallback(() => {
    Alert.alert('Keluar', 'Anda yakin ingin keluar dari akun?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: signOut },
    ]);
  }, [signOut]);

  const handleNavigate = useCallback((dest) => navigation.navigate(dest), [navigation]);

  const goToProfile = useCallback(() => navigation.navigate('Profile'), [navigation]);
  const goToKas = useCallback(() => navigation.navigate('E-Kas'), [navigation]);
  const goToMateri = useCallback(() => navigation.navigate('Materi'), [navigation]);
  const goToProker = useCallback(() => navigation.navigate('Proker'), [navigation]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.name ?? 'Anggota'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity onPress={goToProfile} activeOpacity={0.85} style={styles.avatarWrap}>
            <AvatarDisplay avatar={avatar} name={user?.name} size={48} borderRadius={14} />
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
        <KasRingkasanCard onPress={goToKas} />
      </View>

      {/* ── Menu Utama ───────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menu Utama</Text>
        <View style={styles.menuGrid}>
          <MenuItem
            iconName="camera"
            label="Presensi"
            color={MENU_ICON_COLORS.presensi}
            route="Scan QR"
            onNavigate={handleNavigate}
          />
          <MenuItem
            iconName="coins"
            label="E-Kas"
            color={MENU_ICON_COLORS.kas}
            route="E-Kas"
            onNavigate={handleNavigate}
          />
          <MenuItem
            iconName="vote-yea"
            label="E-Voting"
            color={MENU_ICON_COLORS.voting}
            route="E-Voting"
            onNavigate={handleNavigate}
          />
          <MenuItem
            iconName="tasks"
            label="Proker"
            color={MENU_ICON_COLORS.proker}
            route="Proker"
            onNavigate={handleNavigate}
          />
          <MenuItem
            iconName="book-open"
            label="Materi"
            color={MENU_ICON_COLORS.materi}
            route="Materi"
            onNavigate={handleNavigate}
          />
          <MenuItem
            iconName="id-card"
            label="ID Card"
            color={MENU_ICON_COLORS.idcard}
            route="IdCard"
            onNavigate={handleNavigate}
          />
          <MenuItem
            iconName="clipboard-list"
            label="Riwayat"
            color={MENU_ICON_COLORS.riwayat}
            route="Riwayat"
            onNavigate={handleNavigate}
          />
          <MenuItem
            iconName="user-circle"
            label="Profil"
            color={MENU_ICON_COLORS.profil}
            route="Profile"
            onNavigate={handleNavigate}
          />
        </View>
      </View>

      {/* ── Pembelajaran ─────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pembelajaran</Text>
        <MateriRingkasanCard onPress={goToMateri} />
      </View>

      {/* ── Program Kerja ────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Program Kerja</Text>
        <ProkerRingkasanCard onPress={goToProker} />
      </View>

      {/* ── Info Cara Presensi ───────────────────────────── */}
      <View style={styles.section}>
        <View style={styles.infoCard}>
          <View style={styles.infoIconBox}>
            <FontAwesome5 name="lightbulb" size={22} color={colors.infoText} solid />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Cara Presensi</Text>
            <Text style={styles.infoDesc}>
              1. Tap menu {'"Scan QR"'} di bawah{'\n'}
              2. Arahkan kamera ke QR Code panitia{'\n'}
              3. Tunggu konfirmasi kehadiran Anda
            </Text>
          </View>
        </View>
      </View>

      {/* ── Logout ───────────────────────────────────────── */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
          <FontAwesome5 name="sign-out-alt" size={15} color={colors.errorAccent} />
          <Text style={styles.btnLogoutText}>Keluar dari Akun</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const MenuItem = memo(function MenuItem({ iconName, label, color, route, onNavigate }) {
  const handlePress = useCallback(() => onNavigate(route), [onNavigate, route]);
  return (
    <TouchableOpacity style={styles.menuItem} onPress={handlePress} activeOpacity={0.75}>
      <View style={[styles.menuIconCircle, { backgroundColor: color }]}>
        <FontAwesome5 name={iconName} size={22} color={colors.labelOnPrimary} solid />
      </View>
      <Text style={styles.menuItemLabel}>{label}</Text>
    </TouchableOpacity>
  );
});
