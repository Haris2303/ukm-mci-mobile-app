// src/features/profile/hooks/useProfile.js
// Server state + mutation untuk fitur Profile & ID Card

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getMyIdCard } from '@services/idCardApi';
import {
  getProfile,
  uploadAvatarPhoto,
  setEmojiAvatar,
  changePassword,
  // useLastPhotoAvatar namanya mirip hook — alias agar tidak memicu lint warning
  useLastPhotoAvatar as restoreLastPhoto,
} from '@services/profileApi';

import { useAuth } from '../../../context/AuthContext';

// ── Query key factory ─────────────────────────────────────────────────────────
export const profileKeys = {
  profile: ['profile'],
  idCard: ['idCard'],
};

const PROFILE_STALE = 10 * 60 * 1000; // 10 menit — biodata jarang berubah
const IDCARD_STALE = 30 * 60 * 1000; // 30 menit — ID card sangat jarang berubah

/**
 * useProfile — data profil user (nama, email, avatar, divisi, dll).
 *
 * refetchOnWindowFocus: true → saat app kembali dari background,
 * avatar & biodata di ProfileScreen selalu fresh.
 * staleTime 10 menit → fetch pertama saja yang blocking, selanjutnya background.
 */
export function useProfile() {
  return useQuery({
    queryKey: profileKeys.profile,
    queryFn: async () => {
      const res = await getProfile();
      return res.data; // unwrap: { name, email, avatar, divisi, ... }
    },
    staleTime: PROFILE_STALE,
    refetchOnWindowFocus: true,
  });
}

/**
 * useIdCard — data ID card digital (member_id, qr_code, background, dll).
 *
 * staleTime 30 menit — ID card hampir tidak pernah berubah setelah dibuat.
 * Dibagi antara ProfileScreen (preview member_id) dan IdCardScreen (tampilan penuh).
 */
export function useIdCard() {
  return useQuery({
    queryKey: profileKeys.idCard,
    queryFn: () => getMyIdCard(), // response langsung (tidak ada .data wrapper)
    staleTime: IDCARD_STALE,
  });
}

/**
 * useUpdateAvatar — mutation untuk mengganti avatar (foto / emoji / foto terakhir).
 *
 * Menerima objek pendingAvatar:
 *   { type: "photo",      uri, mimeType }
 *   { type: "emoji",      emoji, bg }
 *   { type: "last_photo" }
 *
 * onSuccess:
 *   (a) Invalidate ['profile'] → ProfileScreen & EditAvatarScreen langsung refresh.
 *   (b) Sync AuthContext:
 *       - Emoji: diketahui langsung → updateAvatar dipanggil segera.
 *       - Foto / foto terakhir: ProfileScreen punya useEffect yang watch
 *         profile?.avatar dan akan sync setelah cache terupdate.
 *
 * onError: tidak ada Alert di hook — semua error avatar bersifat domain-spesifik
 * (COOLDOWN_AKTIF, TIDAK_ADA_FOTO_LAMA) dan ditangani di component.
 */
export function useUpdateAvatar() {
  const queryClient = useQueryClient();
  const { updateAvatar } = useAuth();

  return useMutation({
    mutationFn: async (pendingAvatar) => {
      if (pendingAvatar.type === 'photo')
        return uploadAvatarPhoto(pendingAvatar.uri, pendingAvatar.mimeType);
      if (pendingAvatar.type === 'emoji')
        return setEmojiAvatar(pendingAvatar.emoji, pendingAvatar.bg);
      if (pendingAvatar.type === 'last_photo') return restoreLastPhoto();
    },

    onSuccess: (_, variables) => {
      // Invalidate → useProfile() di EditAvatarScreen & ProfileScreen akan refetch
      queryClient.invalidateQueries({ queryKey: profileKeys.profile });

      // Emoji: kita tahu string avatar-nya langsung → sync AuthContext sekarang
      // Foto / foto terakhir: ProfileScreen memiliki useEffect yang sync avatar
      // dari profile?.avatar setelah cache selesai terupdate (lihat ProfileScreen)
      if (variables.type === 'emoji') {
        updateAvatar(`emoji:${variables.emoji}:${variables.bg}`);
      }
    },
  });
}

/**
 * useChangePassword — mutation ganti password.
 *
 * Tidak ada onSuccess/onError di hook karena:
 *   - onSuccess butuh navigation.goBack() → harus di component
 *   - onError butuh setFieldError() → harus di component
 *
 * Komponen memanggil:
 *   changePwd({ currentPassword, newPassword, confirmPassword }, {
 *     onSuccess: () => { Alert(...); navigation.goBack(); },
 *     onError:   (e) => { setFieldError(...) atau Alert(...) },
 *   })
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword, confirmPassword }) =>
      changePassword(currentPassword, newPassword, confirmPassword),
  });
}
