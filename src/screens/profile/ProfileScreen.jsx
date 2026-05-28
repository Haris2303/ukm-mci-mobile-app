// src/screens/ProfileScreen.jsx
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

import { useProfile, useIdCard } from '@features/profile/hooks/useProfile';

import { styles } from '@screens/profile/ProfileScreen.styles';

import { colors } from '@theme/colors';

import AvatarDisplay from '../../components/AvatarDisplay';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, signOut, updateAvatar } = useAuth();

  // ── Server state — dua query paralel ─────────────────────────────────────
  const profileQuery = useProfile();
  const idCardQuery = useIdCard();

  const profile = profileQuery.data;
  const idCard = idCardQuery.data;

  // ── Sync avatar ke AuthContext ────────────────────────────────────────────
  useEffect(() => {
    if (profile?.avatar !== undefined) {
      updateAvatar(profile.avatar ?? null);
    }
  }, [profile?.avatar, updateAvatar]);

  // ── Combined loading & error ──────────────────────────────────────────────
  const isLoading = profileQuery.isLoading || idCardQuery.isLoading;
  const isError = profileQuery.isError || idCardQuery.isError;
  const errorMsg = profileQuery.error?.message ?? idCardQuery.error?.message;

  const handleRetry = useCallback(() => {
    if (profileQuery.isError) profileQuery.refetch();
    if (idCardQuery.isError) idCardQuery.refetch();
  }, [profileQuery, idCardQuery]);

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = useCallback(() => {
    Alert.alert('Keluar', 'Anda yakin ingin keluar dari akun?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: signOut },
    ]);
  }, [signOut]);

  const profileUser = profile ?? idCard?.user ?? user;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ── Avatar + Nama ──────────────────────────────── */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={() => navigation.navigate('EditAvatar')} activeOpacity={0.85}>
            <View style={styles.avatarWrapper}>
              <AvatarDisplay
                avatar={profile?.avatar ?? null}
                name={profileUser?.name}
                size={96}
                borderRadius={20}
                style={styles.avatarBorder}
              />
              <View style={styles.editBadge}>
                <FontAwesome5 name="camera" size={10} color={colors.labelOnPrimary} solid />
              </View>
            </View>
          </TouchableOpacity>

          <Text style={styles.profileName}>{profileUser?.name ?? '—'}</Text>
          <Text style={styles.profileEmail}>{profileUser?.email ?? '—'}</Text>

          {idCard?.member_id && (
            <View style={styles.memberIdBadge}>
              <Text style={styles.memberIdText}>{idCard.member_id}</Text>
            </View>
          )}

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
          onPress={() => navigation.navigate('EditAvatar')}
          activeOpacity={0.85}
        >
          <View style={styles.editAvatarBtnLeft}>
            <View style={styles.editAvatarIconBox}>
              <FontAwesome5 name="user-edit" size={18} color={colors.brand} solid />
            </View>
            <Text style={styles.editAvatarBtnText}>Edit Foto Profil</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={14} color={colors.slate400} />
        </TouchableOpacity>

        {/* ── Ubah Password Button ──────────────────────── */}
        <TouchableOpacity
          style={styles.editAvatarBtn}
          onPress={() => navigation.navigate('EditPassword')}
          activeOpacity={0.85}
        >
          <View style={styles.editAvatarBtnLeft}>
            <View style={styles.editPasswordIconBox}>
              <FontAwesome5 name="lock" size={18} color={colors.amber600} solid />
            </View>
            <Text style={styles.editAvatarBtnText}>Ubah Password</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={14} color={colors.slate400} />
        </TouchableOpacity>

        {/* ── ID Card Button ─────────────────────────────── */}
        <TouchableOpacity
          style={styles.idCardBtn}
          onPress={() => navigation.navigate('IdCard')}
          activeOpacity={0.88}
        >
          <LinearGradient
            colors={[colors.brand, colors.brandLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.idCardBtnGradient}
          >
            <View style={styles.idCardBtnLeft}>
              <View style={styles.idCardIconBox}>
                <FontAwesome5 name="id-card" size={22} color={colors.labelOnPrimary} solid />
              </View>
              <View>
                <Text style={styles.idCardBtnTitle}>ID Card Saya</Text>
                <Text style={styles.idCardBtnSub}>
                  {idCard?.member_id
                    ? `Lihat kartu anggota · ${idCard.member_id}`
                    : 'Lihat kartu anggota digital'}
                </Text>
              </View>
            </View>
            <FontAwesome5 name="chevron-right" size={18} color={colors.whiteAlpha60} />
          </LinearGradient>
        </TouchableOpacity>

        {/* ── Biodata Section ─────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Informasi Pribadi</Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.brand} />
            <Text style={styles.loadingSmall}>Memuat data...</Text>
          </View>
        ) : isError ? (
          <View style={styles.errorBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <FontAwesome5
                name="exclamation-triangle"
                size={13}
                color={colors.warningText}
                solid
              />
              <Text style={styles.errorSmall}>{errorMsg}</Text>
            </View>
            <TouchableOpacity onPress={handleRetry}>
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
            <BioRow
              iconName="tag"
              label="Role"
              value={profileUser?.role_label ?? profileUser?.role}
            />
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
          <FontAwesome5 name="sign-out-alt" size={15} color={colors.errorAccent} />
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
        <FontAwesome5 name={iconName} size={16} color={colors.slate400} solid />
      </View>
      <View style={styles.bioContent}>
        <Text style={styles.bioLabel}>{label}</Text>
        <Text style={styles.bioValue}>{value ?? '—'}</Text>
      </View>
    </View>
  );
}
