// src/services/votingApi.js
// Semua komunikasi e-voting dengan server Laravel

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

/** Ambil semua pemilihan aktif/selesai */
export const getElections = async () => {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/elections`, { headers });
  return handleResponse(res);
};

/** Detail pemilihan + info sudah vote atau belum */
export const getElectionDetail = async (id) => {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/elections/${id}`, { headers });
  return handleResponse(res);
};

/** Kirim suara ke kandidat */
export const kirimSuara = async (electionId, candidateId) => {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/elections/${electionId}/vote`, {
    method: "POST",
    headers,
    body: JSON.stringify({ candidate_id: candidateId }),
  });
  return handleResponse(res);
};

/** Ambil hasil voting */
export const getHasil = async (electionId) => {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/elections/${electionId}/hasil`, {
    headers,
  });
  return handleResponse(res);
};
