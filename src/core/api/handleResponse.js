import AsyncStorage from '@react-native-async-storage/async-storage';

let _signOut = null;

export const setSignOutHandler = (fn) => {
  _signOut = fn;
};

export const handleResponse = async (response) => {
  let json;
  try {
    json = await response.json();
  } catch {
    if (!response.ok) {
      const err = new Error(`Server error (${response.status})`);
      err.status = response.status;
      throw err;
    }
    return {};
  }

  if (response.status === 401) {
    await AsyncStorage.multiRemove(['auth_token', 'auth_user']);
    _signOut?.();
    const err = new Error(
      json.pesan || json.message || 'Sesi Anda telah berakhir. Silakan login kembali.'
    );
    err.kode = 'UNAUTHENTICATED';
    err.responseData = json;
    throw err;
  }

  if (response.status === 403 && json.kode === 'AKUN_DEMISIONER') {
    await AsyncStorage.multiRemove(['auth_token', 'auth_user']);
    _signOut?.();
    const err = new Error(json.pesan ?? 'Akun Anda telah dinonaktifkan.');
    err.kode = 'AKUN_DEMISIONER';
    err.responseData = json;
    throw err;
  }

  if (!response.ok) {
    const err = new Error(
      json.pesan ||
        json.message ||
        (json.errors ? Object.values(json.errors).flat().join('\n') : null) ||
        'Terjadi kesalahan. Coba lagi.'
    );
    err.status = response.status;
    err.kode = json.kode ?? null;
    err.responseData = json;
    throw err;
  }

  return json;
};
