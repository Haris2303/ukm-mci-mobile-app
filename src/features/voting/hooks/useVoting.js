// src/features/voting/hooks/useVoting.js
// Server state + mutation untuk fitur E-Voting

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

import { getElections, getElectionDetail, kirimSuara, getHasil } from '@services/votingApi';

// ── Query key factory ─────────────────────────────────────────────────────────
// Semua konsumen pakai key yang sama → satu cache entry, tidak ada duplikasi.
// Invalidasi cukup pakai electionKeys.all / .detail(id) / .hasil(id).
export const electionKeys = {
  all: ['elections'],
  detail: (id) => ['elections', id],
  hasil: (id) => ['elections', id, 'hasil'],
};

const ELECTIONS_STALE = 1 * 60 * 1000; // 1 menit  — list cukup dinamis
const DETAIL_STALE = 30 * 1000; // 30 detik — sudah_vote bisa berubah segera
const HASIL_STALE = 2 * 60 * 1000; // 2 menit  — hasil berubah saat ada vote baru

/**
 * useElections — daftar semua pemilihan aktif / selesai.
 *
 * refetchOnWindowFocus: true → saat user balik dari background,
 * list selalu fresh (badge "✓ Sudah Memilih" ikut update).
 */
export function useElections() {
  return useQuery({
    queryKey: electionKeys.all,
    queryFn: async () => {
      const res = await getElections();
      return res.data ?? [];
    },
    staleTime: ELECTIONS_STALE,
    refetchOnWindowFocus: true,
  });
}

/**
 * useElectionDetail — detail satu pemilihan + daftar kandidat.
 *
 * staleTime pendek (30 detik) karena setelah user vote,
 * field sudah_vote & total_suara harus segera ter-refresh.
 *
 * enabled: !!id — tidak fetch kalau id belum ada (deep-link belum resolve).
 */
export function useElectionDetail(id) {
  return useQuery({
    queryKey: electionKeys.detail(id),
    queryFn: async () => {
      const res = await getElectionDetail(id);
      return res.data;
    },
    staleTime: DETAIL_STALE,
    enabled: !!id,
  });
}

/**
 * useHasil — rekap hasil suara untuk satu pemilihan.
 */
export function useHasil(id) {
  return useQuery({
    queryKey: electionKeys.hasil(id),
    queryFn: async () => {
      const res = await getHasil(id);
      return res.data;
    },
    staleTime: HASIL_STALE,
    enabled: !!id,
  });
}

/**
 * useKirimSuara — mutation mengirim suara.
 *
 * Cache invalidation pada onSuccess:
 *   - electionKeys.detail(id) → sudah_vote = true + total_suara naik
 *   - electionKeys.all        → badge "✓ Sudah Memilih" di ElectionListScreen
 *
 * onError → Alert cukup di sini; tidak perlu diulang di komponen.
 *
 * Komponen cukup panggil:
 *   mutate({ electionId, candidateId }, {
 *     onSuccess: () => { setShowConfirm(false); Alert("Berhasil"); navigate(...) }
 *     onError:   () => { setShowConfirm(false) }  // Alert sudah dari sini
 *   })
 */
export function useKirimSuara() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ electionId, candidateId }) => kirimSuara(electionId, candidateId),

    onSuccess: (_, { electionId }) => {
      // Invalidate detail → sudah_vote & total_suara langsung ter-refresh
      queryClient.invalidateQueries({ queryKey: electionKeys.detail(electionId) });
      // Invalidate list → badge "✓ Sudah Memilih" ikut muncul
      queryClient.invalidateQueries({ queryKey: electionKeys.all });
    },

    onError: (error) => {
      Alert.alert('Gagal Mengirim Suara', error.message);
    },
  });
}
