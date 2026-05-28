import { useQuery } from '@tanstack/react-query';

import { getMateri } from '@services/materiApi';

// ── Query key factory ─────────────────────────────────────────────────────────
// Semua konsumen (MateriScreen + MateriRingkasanCard) pakai key yang sama
// → React Query otomatis share satu cache entry, tidak ada duplikasi request.
export const materiKeys = {
  all: ['materi'],
};

const MATERI_STALE = 10 * 60 * 1000; // 10 menit — materi jarang berubah

/**
 * useMateri — server state untuk daftar materi.
 *
 * Returns semua field dari useQuery:
 *   data        → res.data (sudah di-unwrap dari response wrapper)
 *   isLoading   → true saat fetch pertama (belum ada cache)
 *   isError     → true jika fetch gagal
 *   error       → Error object (pakai di ErrorState untuk auto-classify)
 *   refetch     → fungsi untuk trigger refetch manual (pull-to-refresh)
 *   isRefetching→ true saat background refetch (opsional, kalau butuh spinner)
 */
export function useMateri() {
  return useQuery({
    queryKey: materiKeys.all,
    queryFn: async () => {
      const res = await getMateri();
      return res.data; // unwrap: { materi, total, jumlah_umum, jumlah_divisi }
    },
    staleTime: MATERI_STALE,
  });
}
