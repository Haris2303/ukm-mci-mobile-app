// src/services/materiApi.js
// Komunikasi dengan endpoint /api/materi

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

/** Ambil daftar materi yang relevan untuk user (umum + divisi user) */
export const getMateri = async () => {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/materi`, { headers });
  return handleResponse(res);
};
