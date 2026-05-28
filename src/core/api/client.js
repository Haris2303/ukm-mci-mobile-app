import AsyncStorage from '@react-native-async-storage/async-storage';

import { BASE_URL } from '@config/apiConfig';

import { handleResponse } from './handleResponse';

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const publicHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const apiClient = {
  async get(endpoint, options = {}) {
    const headers = options.skipAuth ? publicHeaders : await getAuthHeaders();
    const res = await fetch(`${BASE_URL}${endpoint}`, { headers });
    return handleResponse(res);
  },

  async post(endpoint, body, options = {}) {
    const headers = options.skipAuth ? publicHeaders : await getAuthHeaders();
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  // Content-Type sengaja tidak di-set agar RN otomatis inject multipart boundary
  async upload(endpoint, formData, options = {}) {
    const token = await AsyncStorage.getItem('auth_token');
    const headers = options.skipAuth
      ? { Accept: 'application/json' }
      : { Accept: 'application/json', Authorization: `Bearer ${token}` };
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse(res);
  },
};

export default apiClient;
