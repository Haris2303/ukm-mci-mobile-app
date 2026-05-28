import { useQuery } from '@tanstack/react-query';

import { getTunggakan, getRiwayatKas, getSaldoTransparansi } from '../api/kasApi';

// staleTime KAS: 5 menit — data keuangan tidak perlu real-time
const KAS_STALE = 5 * 60 * 1000;

// Query key factory — dipakai untuk invalidateQueries({ queryKey: kasKeys.all })
export const kasKeys = {
  all: ['kas'],
  tunggakan: ['kas', 'tunggakan'],
  riwayat: ['kas', 'riwayat'],
  saldo: ['kas', 'saldo'],
};

export function useKasTunggakan() {
  return useQuery({
    queryKey: kasKeys.tunggakan,
    queryFn: async () => {
      const res = await getTunggakan();
      return res.data;
    },
    staleTime: KAS_STALE,
  });
}

export function useKasRiwayat() {
  return useQuery({
    queryKey: kasKeys.riwayat,
    queryFn: async () => {
      const res = await getRiwayatKas();
      return res.data;
    },
    staleTime: KAS_STALE,
  });
}

export function useKasSaldo() {
  return useQuery({
    queryKey: kasKeys.saldo,
    queryFn: async () => {
      const res = await getSaldoTransparansi();
      return res.data;
    },
    staleTime: KAS_STALE,
  });
}
