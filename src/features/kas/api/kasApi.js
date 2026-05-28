import apiClient from '@core/api/client';
import { ENDPOINTS } from '@core/api/endpoints';

export const getTunggakan = () => apiClient.get(ENDPOINTS.KAS.TUNGGAKAN);
export const getRiwayatKas = () => apiClient.get(ENDPOINTS.KAS.RIWAYAT);
export const getSaldoTransparansi = () => apiClient.get(ENDPOINTS.KAS.SALDO);

export const formatRupiah = (nominal) => {
  if (typeof nominal !== 'number') return 'Rp 0';
  return 'Rp ' + nominal.toLocaleString('id-ID');
};
