// src/services/kasApi.js
// Semua komunikasi e-kas dengan server Laravel

import AsyncStorage from "@react-native-async-storage/async-storage";

import { BASE_URL } from "../config/apiConfig";
import { handleResponse } from "./apiClient";

const authHeaders = async () => {
  const token = await AsyncStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
};

/** Tagihan yang BELUM dibayar oleh user yang login */
export const getTunggakan = async () => {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/kas/tunggakan`, { headers });
  return handleResponse(res);
};

/** Riwayat pembayaran (status LUNAS) milik user */
export const getRiwayatKas = async () => {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/kas/riwayat`, { headers });
  return handleResponse(res);
};

/** Total saldo kas organisasi (transparansi) */
export const getSaldoTransparansi = async () => {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/kas/saldo-transparansi`, { headers });
  return handleResponse(res);
};

/** Helper format Rupiah di sisi client (jika dibutuhkan) */
export const formatRupiah = (nominal) => {
  if (typeof nominal !== "number") return "Rp 0";
  return "Rp " + nominal.toLocaleString("id-ID");
};
