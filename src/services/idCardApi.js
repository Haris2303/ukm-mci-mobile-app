// src/services/idCardApi.js
// API untuk fitur ID Card anggota

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

const handleResponse = async (response) => {
  const json = await response.json();
  if (!response.ok) {
    const pesan =
      json.pesan ||
      json.message ||
      (json.errors ? Object.values(json.errors).flat().join("\n") : null) ||
      "Terjadi kesalahan. Coba lagi.";
    throw new Error(pesan);
  }
  return json;
};

/**
 * Ambil data ID Card milik user yang sedang login.
 * Requires: Bearer token (auth)
 */
export const getMyIdCard = async () => {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/id-card/me`, { headers });
  return handleResponse(res);
};

/**
 * Ambil data ID Card user tertentu (public, tanpa auth).
 * @param {number} userId - ID user
 */
export const getIdCardByUserId = async (userId) => {
  const res = await fetch(`${BASE_URL}/id-card/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return handleResponse(res);
};
