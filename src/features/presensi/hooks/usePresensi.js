// src/features/presensi/hooks/usePresensi.js
// Server state + mutation untuk fitur Presensi

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getRiwayatPresensi, catatPresensi } from '@services/api';

// ── Query key factory ─────────────────────────────────────────────────────────
export const presensiKeys = {
  riwayat: ['presensi', 'riwayat'],
};

const RIWAYAT_STALE = 5 * 60 * 1000; // 5 menit

/**
 * useRiwayatPresensi — daftar riwayat kehadiran user.
 *
 * staleTime 5 menit — riwayat cukup stabil; background refetch saat
 * kembali dari layar lain sudah cukup menjaga kesegaran data.
 */
export function useRiwayatPresensi() {
  return useQuery({
    queryKey: presensiKeys.riwayat,
    queryFn: async () => {
      const res = await getRiwayatPresensi();
      return res.data?.data ?? []; // unwrap: array riwayat presensi
    },
    staleTime: RIWAYAT_STALE,
  });
}

/**
 * useCatatPresensi — mutation untuk mencatat kehadiran via scan QR.
 *
 * mutationFn menerima `token` (string 32 karakter dari QR Code).
 *
 * onSuccess: invalidate cache riwayat agar RiwayatScreen langsung
 * menampilkan entri baru setelah presensi berhasil dicatat.
 *
 * Tidak ada onError di hook — ScanScreen menggunakan fire-and-display
 * pattern: pesan sukses/error ditampilkan langsung di layar, bukan Alert.
 * Semua callback (setMessage, setStatus) ada di component.
 */
export function useCatatPresensi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token) => catatPresensi(token),

    onSuccess: () => {
      // Invalidate riwayat → jika user buka RiwayatScreen sesudahnya,
      // data sudah fresh dan mencakup entri baru.
      queryClient.invalidateQueries({ queryKey: presensiKeys.riwayat });
    },
  });
}
