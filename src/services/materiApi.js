// src/services/materiApi.js
// Komunikasi dengan endpoint /api/materi

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

/** Ambil daftar materi yang relevan untuk user (umum + divisi user) */
export const getMateri = async () => {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/materi`, { headers });
  return handleResponse(res);
};
