// src/services/apiClient.js
// Central HTTP response handler — detects 401 and auto-redirects to login.

import AsyncStorage from "@react-native-async-storage/async-storage";

let _signOut = null;

/** Dipanggil dari AuthContext setelah signOut tersedia. */
export const setSignOutHandler = (fn) => {
  _signOut = fn;
};

/**
 * Central response handler untuk semua service API.
 * - 401 → hapus token + redirect ke login
 * - 403 AKUN_DEMISIONER → hapus token + redirect ke login
 * - Error lain → throw dengan kode & responseData untuk handling khusus
 */
export const handleResponse = async (response) => {
  let json;
  try {
    json = await response.json();
  } catch {
    if (!response.ok) throw new Error(`Server error (${response.status})`);
    return {};
  }

  // Token tidak valid / sesi habis
  if (response.status === 401) {
    await AsyncStorage.multiRemove(["auth_token", "auth_user"]);
    _signOut?.();
    const err = new Error(
      json.pesan || json.message || "Sesi Anda telah berakhir. Silakan login kembali."
    );
    err.kode = "UNAUTHENTICATED";
    err.responseData = json;
    throw err;
  }

  // Akun demisioner — diblokir total
  if (response.status === 403 && json.kode === "AKUN_DEMISIONER") {
    await AsyncStorage.multiRemove(["auth_token", "auth_user"]);
    _signOut?.();
    const err = new Error(json.pesan ?? "Akun Anda telah dinonaktifkan.");
    err.kode = "AKUN_DEMISIONER";
    err.responseData = json;
    throw err;
  }

  if (!response.ok) {
    const err = new Error(
      json.pesan ||
        json.message ||
        (json.errors ? Object.values(json.errors).flat().join("\n") : null) ||
        "Terjadi kesalahan. Coba lagi."
    );
    err.kode = json.kode ?? null;
    err.responseData = json;
    throw err;
  }

  return json;
};
