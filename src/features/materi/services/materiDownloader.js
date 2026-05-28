/**
 * materiDownloader.js
 *
 * Pure JS service — tidak import React atau RN UI components.
 * Semua error di-throw; UI yang bertanggung jawab menampilkannya.
 *
 * Cache strategy:
 *   - AsyncStorage menyimpan timestamp download terakhir per materi.
 *   - FileSystem.getInfoAsync memverifikasi file masih ada di disk.
 *   - Kedua kondisi harus true agar dianggap cached — mencegah state
 *     stale jika user menghapus app storage manual.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

const CACHE_KEY_PREFIX = 'materi_downloaded_';

function getLocalUri(materiId) {
  return `${FileSystem.documentDirectory}materi-${materiId}.pdf`;
}

/**
 * Cek apakah materi sudah ter-download dan file-nya masih ada di disk.
 * @param {string|number} materiId
 * @returns {Promise<boolean>}
 */
export async function isMateriCached(materiId) {
  const [cached, fileInfo] = await Promise.all([
    AsyncStorage.getItem(`${CACHE_KEY_PREFIX}${materiId}`),
    FileSystem.getInfoAsync(getLocalUri(materiId)),
  ]);
  return !!(cached && fileInfo.exists);
}

/**
 * Download PDF materi ke storage lokal.
 * Jika sudah ada di cache, langsung return URI lokal tanpa download ulang.
 *
 * @param {{ id: string|number, file_url: string }} materi
 * @param {((progress: { totalBytesWritten: number, totalBytesExpectedToWrite: number }) => void) | undefined} onProgress
 * @returns {Promise<string>} Local file URI
 */
export async function downloadMateri(materi, onProgress) {
  const localUri = getLocalUri(materi.id);

  if (await isMateriCached(materi.id)) return localUri;

  let resultUri;
  if (onProgress) {
    // Gunakan resumable jika caller ingin progress — API identik, behavior sama
    const task = FileSystem.createDownloadResumable(materi.file_url, localUri, {}, onProgress);
    const result = await task.downloadAsync();
    resultUri = result.uri;
  } else {
    const result = await FileSystem.downloadAsync(materi.file_url, localUri);
    resultUri = result.uri;
  }

  // Tandai cache setelah download berhasil
  await AsyncStorage.setItem(`${CACHE_KEY_PREFIX}${materi.id}`, new Date().toISOString());

  return resultUri;
}

/**
 * Buka file PDF di aplikasi sistem.
 * Android: IntentLauncher (user pilih app PDF), fallback ke Sharing.
 * iOS: Sharing — Quick Look menampilkan preview PDF.
 *
 * @param {string} uri Local file URI
 * @returns {Promise<void>}
 */
export async function openMateriFile(uri) {
  if (Platform.OS === 'android') {
    try {
      const contentUri = await FileSystem.getContentUriAsync(uri);
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: contentUri,
        flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
        type: 'application/pdf',
      });
    } catch {
      // Fallback: tidak ada app PDF terpasang
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
    }
  } else {
    await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
  }
}

/**
 * Helper gabungan: download (atau ambil dari cache) lalu buka file.
 * Ini entry point utama yang dipanggil dari UI.
 *
 * @param {{ id: string|number, file_url: string }} materi
 * @param {Function | undefined} onProgress
 * @returns {Promise<void>}
 */
export async function downloadAndOpen(materi, onProgress) {
  const uri = await downloadMateri(materi, onProgress);
  await openMateriFile(uri);
}
