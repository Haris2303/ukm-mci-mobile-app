/**
 * openExternalLink.js
 *
 * Utility untuk membuka URL di browser/app sistem.
 * Throws jika URL tidak valid atau tidak ada app yang bisa menanganinya —
 * biarkan caller yang memutuskan cara menampilkan error ke user.
 *
 * @param {string} url
 * @returns {Promise<void>}
 * @throws {Error} Jika URL tidak bisa dibuka
 */

import { Linking } from "react-native";

export default async function openExternalLink(url) {
  const supported = await Linking.canOpenURL(url);
  if (!supported) {
    throw new Error("URL tidak valid atau tidak ada aplikasi yang mendukung.");
  }
  await Linking.openURL(url);
}
