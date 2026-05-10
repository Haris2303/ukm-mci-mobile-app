// src/services/api.js
// ─────────────────────────────────────────────────────────────
// Semua komunikasi dengan server Laravel ada di sini.
// Ganti BASE_URL dengan IP komputer Anda di jaringan WiFi!
// ─────────────────────────────────────────────────────────────

import AsyncStorage from "@react-native-async-storage/async-storage";

import { BASE_URL } from "../config/apiConfig";

// ── Helper: buat headers dengan token ────────────────────────
const authHeaders = async () => {
  const token = await AsyncStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ── Helper: handle response dari server ──────────────────────
const handleResponse = async (response) => {
  const json = await response.json();
  if (!response.ok) {
    // Ambil pesan error dari server (sudah Bahasa Indonesia)
    const pesan =
      json.pesan ||
      json.message ||
      (json.errors ? Object.values(json.errors).flat().join("\n") : null) ||
      "Terjadi kesalahan. Coba lagi.";
    throw new Error(pesan);
  }
  return json;
};

// ═══════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════

export const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await handleResponse(response);
  // Simpan token & data user ke storage HP
  await AsyncStorage.setItem("auth_token", json.data.token);
  await AsyncStorage.setItem("auth_user", JSON.stringify(json.data.user));
  return json;
};

export const logout = async () => {
  const headers = await authHeaders();
  await fetch(`${BASE_URL}/auth/logout`, { method: "POST", headers });
  await AsyncStorage.removeItem("auth_token");
  await AsyncStorage.removeItem("auth_user");
};

export const getStoredUser = async () => {
  const user = await AsyncStorage.getItem("auth_user");
  return user ? JSON.parse(user) : null;
};

export const isLoggedIn = async () => {
  const token = await AsyncStorage.getItem("auth_token");
  return !!token;
};

// ═══════════════════════════════════════════════════════════════
// PRESENSI
// ═══════════════════════════════════════════════════════════════

/**
 * Kirim token hasil scan QR ke server.
 * @param {string} token - Token 32 karakter dari QR Code
 */
export const catatPresensi = async (token) => {
  const headers = await authHeaders();
  const response = await fetch(`${BASE_URL}/presensi`, {
    method: "POST",
    headers,
    body: JSON.stringify({ token }),
  });
  return handleResponse(response);
};

/**
 * Ambil riwayat presensi milik user yang login.
 */
export const getRiwayatPresensi = async (page = 1) => {
  const headers = await authHeaders();
  const response = await fetch(`${BASE_URL}/presensi/riwayat?page=${page}`, {
    headers,
  });
  return handleResponse(response);
};
