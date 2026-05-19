// src/services/profileApi.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config/apiConfig";
import { handleResponse } from "./apiClient";

export const STORAGE_URL = BASE_URL.replace(/\/api$/, "/storage");

const authHeaders = async () => {
  const token = await AsyncStorage.getItem("auth_token");
  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getProfile = async () => {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/profile`, { headers });
  return handleResponse(res);
};

export const uploadAvatarPhoto = async (uri, mimeType = "image/jpeg") => {
  const headers = await authHeaders();
  const formData = new FormData();
  formData.append("mode", "photo");
  formData.append("foto", {
    uri,
    type: mimeType,
    name: `avatar.${mimeType.split("/")[1] ?? "jpg"}`,
  });
  const res = await fetch(`${BASE_URL}/profile/avatar`, {
    method: "POST",
    headers,
    body: formData,
  });
  return handleResponse(res);
};

export const setEmojiAvatar = async (emoji, bg) => {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/profile/avatar`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "emoji", emoji, bg }),
  });
  return handleResponse(res);
};

export const changePassword = async (currentPassword, newPassword, newPasswordConfirmation) => {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/profile/password`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation,
    }),
  });
  return handleResponse(res);
};

export const useLastPhotoAvatar = async () => {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/profile/avatar`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "last_photo" }),
  });
  return handleResponse(res);
};
