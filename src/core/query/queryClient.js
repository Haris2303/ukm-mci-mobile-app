import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      // Exponential backoff: 1s → 2s → 4s … maks 30 s
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 menit default
      gcTime: 10 * 60 * 1000, // garbage collect setelah 10 menit tidak dipakai
      refetchOnWindowFocus: false, // tidak relevan di React Native
      refetchOnReconnect: true, // otomatis refetch saat koneksi pulih
    },
  },
});
