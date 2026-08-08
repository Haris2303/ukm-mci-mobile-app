// src/services/idCardApi.js
// API untuk fitur ID Card anggota

import AsyncStorage from '@react-native-async-storage/async-storage';

import { handleResponse } from './apiClient';
import { BASE_URL } from '../config/apiConfig';

/**
 * @typedef {Object} IdCardTemplateColors
 * @property {string} card_background
 * @property {string} border
 * @property {[string, string]} header_gradient
 * @property {string} accent
 * @property {string} badge_background
 * @property {string} badge_text
 * @property {string} badge_border
 * @property {string} text_color
 * @property {string} divider
 */

/**
 * @typedef {Object} IdCardTemplate
 * @property {string} slug
 * @property {string} label
 * @property {IdCardTemplateColors} colors
 */

/**
 * @typedef {Object} IdCardResponse
 * @property {Object} user
 * @property {string} member_id
 * @property {string} avatar
 * @property {string|null} foto_url
 * @property {string|null} background_image_url
 * @property {IdCardTemplate} [template]
 * @property {string} card_url
 * @property {string} profile_url
 */

/**
 * Fallback template colors — dipakai jika response tidak menyertakan `template`
 * sama sekali (mis. backend versi lama). Nilainya sama dengan template
 * "biru-klasik".
 * @type {IdCardTemplateColors}
 */
export const DEFAULT_TEMPLATE_COLORS = {
  card_background: '#ffffff',
  border: '#1a4ff5',
  header_gradient: ['#1340e1', '#3671ff'],
  accent: '#1a4ff5',
  badge_background: '#eef5ff',
  badge_text: '#1a4ff5',
  badge_border: '#bdd8ff',
  text_color: '#0f172a',
  divider: '#1a4ff5',
};

const authHeaders = async () => {
  const token = await AsyncStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };
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
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  return handleResponse(res);
};
