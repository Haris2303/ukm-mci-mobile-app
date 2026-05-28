// src/services/prokerApi.js
// Komunikasi dengan endpoint /api/proker

import AsyncStorage from '@react-native-async-storage/async-storage';

import { handleResponse } from './apiClient';
import { BASE_URL } from '../config/apiConfig';

const authHeaders = async () => {
  const token = await AsyncStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };
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
