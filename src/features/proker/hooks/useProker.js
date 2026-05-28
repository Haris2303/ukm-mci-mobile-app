import { useQuery } from '@tanstack/react-query';

import { getProker, getProkerDetail } from '@services/prokerApi';

// ── Query key factory ─────────────────────────────────────────────────────────
// Semua konsumen (ProkerListScreen + ProkerRingkasanCard) pakai key yang sama
// → satu cache entry, tidak ada duplikasi request.
// Detail pakai tuple ['proker', id] → invalidate semua dengan prokerKeys.all.
export const prokerKeys = {
  all: ['proker'],
  detail: (id) => ['proker', id],
};

const PROKER_LIST_STALE = 5 * 60 * 1000; // 5 menit — list dipakai di banyak tempat
const PROKER_DETAIL_STALE = 3 * 60 * 1000; // 3 menit — detail lebih dinamis (progress, tugas)

/**
 * useProker — server state untuk daftar program kerja.
 *
 * Dikonsumsi oleh:
 *   - ProkerListScreen  (tampilan utama)
 *   - ProkerRingkasanCard (HomeScreen preview)
 * Keduanya share cache otomatis karena queryKey identik.
 */
export function useProker() {
  return useQuery({
    queryKey: prokerKeys.all,
    queryFn: async () => {
      const res = await getProker();
      return res.data; // unwrap: { proker[], statistik }
    },
    staleTime: PROKER_LIST_STALE,
  });
}

/**
 * useProkerDetail — server state untuk detail satu program kerja.
 *
 * @param {number|string} id  ID proker dari route.params
 *
 * enabled: !!id → tidak fetch kalau id undefined/null
 * (misal saat screen masih mounting atau deep-link belum resolve)
 */
export function useProkerDetail(id) {
  return useQuery({
    queryKey: prokerKeys.detail(id),
    queryFn: async () => {
      const res = await getProkerDetail(id);
      return res.data; // unwrap: { nama_proker, tugas[], ... }
    },
    staleTime: PROKER_DETAIL_STALE,
    enabled: !!id,
  });
}
