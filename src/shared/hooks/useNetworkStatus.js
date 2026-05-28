import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

/**
 * Mengembalikan status koneksi jaringan secara reaktif.
 *
 * isOffline: true  → definitif tidak terkoneksi
 * isOffline: false → terkoneksi ATAU belum diketahui (null → optimistic online)
 */
export function useNetworkStatus() {
  const [state, setState] = useState({
    isConnected: null,
    isInternetReachable: null,
    type: 'unknown',
  });

  useEffect(() => {
    // Baca state saat ini sekali
    NetInfo.fetch().then(setState);
    // Subscribe perubahan real-time
    return NetInfo.addEventListener(setState);
  }, []);

  return {
    isConnected: state.isConnected,
    isInternetReachable: state.isInternetReachable,
    type: state.type,
    // null dianggap online agar tidak ada "false offline" flash saat mount
    isOffline: state.isConnected === false,
  };
}
