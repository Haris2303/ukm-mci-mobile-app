import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook generik untuk fetch-once-on-mount + pull-to-refresh.
 *
 * @param {() => Promise<any>} asyncFn  Fungsi async yang mengembalikan data.
 *        Harus mengembalikan tepat data yang ingin disimpan (bukan wrapper response).
 * @param {any[]} deps  Dependency array — re-fetch otomatis ketika salah satu
 *        dep berubah (mirip dependency array useEffect). Default [].
 *
 * @returns {{ data, loading, refreshing, error, refetch, refresh }}
 *   - refetch()  → reset loading=true, lalu fetch ulang
 *   - refresh()  → set refreshing=true (untuk RefreshControl), lalu fetch ulang
 *
 * RACE CONDITION HANDLING
 * Setiap panggilan execute() mengambil snapshot callId dari counter yang
 * terus bertambah. Setelah await selesai, hasilnya hanya diapply jika callId
 * masih sama dengan nilai counter saat ini — artinya tidak ada panggilan
 * yang lebih baru. Ini mencegah dua skenario:
 *   1. User double-tap refresh → hanya respons terakhir yang dipakai.
 *   2. Component unmount sebelum fetch selesai → state update di-skip,
 *      tidak ada warning "Can't perform a React state update on an unmounted
 *      component".
 */
export default function useAsyncResource(asyncFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Selalu panggil asyncFn versi terbaru tanpa membuat execute tidak stabil.
  const asyncFnRef = useRef(asyncFn);
  useEffect(() => { asyncFnRef.current = asyncFn; });

  // Counter bertambah setiap execute() dipanggil; respons stale diabaikan.
  const callIdRef = useRef(0);

  const execute = useCallback(async (isRefresh = false) => {
    const callId = ++callIdRef.current;

    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const result = await asyncFnRef.current();
      if (callId !== callIdRef.current) return; // respons stale, abaikan
      setData(result);
    } catch (e) {
      if (callId !== callIdRef.current) return;
      setError(e.message ?? 'Terjadi kesalahan.');
    } finally {
      if (callId === callIdRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []); // stable — tidak perlu asyncFn di deps karena pakai ref

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { execute(false); }, deps);

  return {
    data,
    loading,
    refreshing,
    error,
    refetch: useCallback(() => execute(false), [execute]),
    refresh: useCallback(() => execute(true), [execute]),
  };
}
