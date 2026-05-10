// src/services/prokerApi.js
// Komunikasi dengan endpoint /api/proker

import AsyncStorage from "@react-native-async-storage/async-storage";

import { BASE_URL } from "../config/apiConfig";

const authHeaders = async () => {
  const token = await AsyncStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const handleResponse = async (res) => {
  const json = await res.json();

  // Auto-logout jika akun demisioner
  if (res.status === 403 && json.kode === "AKUN_DEMISIONER") {
    await AsyncStorage.removeItem("auth_token");
    throw new Error(json.pesan);
  }

  if (!res.ok) {
    throw new Error(
      json.pesan ||
        json.message ||
        (json.errors
          ? Object.values(json.errors).flat().join("\n")
          : "Terjadi kesalahan."),
    );
  }
  return json;
};

/** Daftar program kerja yang relevan untuk user (divisi user + umum) */
export const getProker = async () => {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/proker`, { headers });
  return handleResponse(res);
};

/** Detail proker dengan daftar tugas */
export const getProkerDetail = async (id) => {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/proker/${id}`, { headers });
  return handleResponse(res);
};
