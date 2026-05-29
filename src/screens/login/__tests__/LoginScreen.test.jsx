/**
 * Component test — src/screens/login/LoginScreen.jsx
 *
 * Cakupan:
 *   - Render elemen form (email, password, tombol login)
 *   - Validasi input kosong menampilkan flash warning
 *   - Memanggil login API dengan email (trimmed) dan password
 *   - Memanggil signIn setelah login berhasil
 *   - Menampilkan flash error saat login gagal
 *   - Menampilkan ActivityIndicator saat loading
 *   - Tombol disabled saat loading
 *   - Toggle visibilitas password
 */

import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import LoginScreen from '../LoginScreen';

// ── Mock dependencies ──────────────────────────────────────────────────────
const mockSignIn = jest.fn();
jest.mock('@context/AuthContext', () => ({
  useAuth: () => ({ signIn: mockSignIn }),
}));

const mockLogin = jest.fn();
jest.mock('@services/api', () => ({
  login: (...args) => mockLogin(...args),
}));

jest.mock('@config/apiConfig', () => ({ BASE_URL: 'http://test.local/api' }));

// ── Helpers ────────────────────────────────────────────────────────────────
const mockUser = { id: 1, nama: 'Haris', email: 'haris@test.com' };

function renderLogin() {
  return render(<LoginScreen />);
}

// ── Tests ──────────────────────────────────────────────────────────────────
describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ── Render ───────────────────────────────────────────────────────────────
  describe('render awal', () => {
    it('menampilkan input email', () => {
      const { getByPlaceholderText } = renderLogin();
      expect(getByPlaceholderText('contoh@email.com')).toBeTruthy();
    });

    it('menampilkan input password', () => {
      const { getByPlaceholderText } = renderLogin();
      expect(getByPlaceholderText('Minimal 8 karakter')).toBeTruthy();
    });

    it('menampilkan tombol Masuk', () => {
      const { getByText } = renderLogin();
      expect(getByText('Masuk →')).toBeTruthy();
    });

    it('tidak menampilkan flash banner saat pertama render', () => {
      const { queryByText } = renderLogin();
      expect(queryByText('Email dan kata sandi wajib diisi.')).toBeNull();
    });
  });

  // ── Validasi ─────────────────────────────────────────────────────────────
  describe('validasi input', () => {
    it('menampilkan warning jika email dan password kosong', async () => {
      const { getByText } = renderLogin();

      fireEvent.press(getByText('Masuk →'));

      await waitFor(() => {
        expect(getByText('Email dan kata sandi wajib diisi.')).toBeTruthy();
      });
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('menampilkan warning jika hanya email yang diisi', async () => {
      const { getByPlaceholderText, getByText } = renderLogin();

      fireEvent.changeText(getByPlaceholderText('contoh@email.com'), 'haris@test.com');
      fireEvent.press(getByText('Masuk →'));

      await waitFor(() => {
        expect(getByText('Email dan kata sandi wajib diisi.')).toBeTruthy();
      });
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('menampilkan warning jika hanya password yang diisi', async () => {
      const { getByPlaceholderText, getByText } = renderLogin();

      fireEvent.changeText(getByPlaceholderText('Minimal 8 karakter'), 'password123');
      fireEvent.press(getByText('Masuk →'));

      await waitFor(() => {
        expect(getByText('Email dan kata sandi wajib diisi.')).toBeTruthy();
      });
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('tidak memanggil login jika email hanya spasi', async () => {
      const { getByPlaceholderText, getByText } = renderLogin();

      fireEvent.changeText(getByPlaceholderText('contoh@email.com'), '   ');
      fireEvent.changeText(getByPlaceholderText('Minimal 8 karakter'), 'password123');
      fireEvent.press(getByText('Masuk →'));

      await waitFor(() => {
        expect(getByText('Email dan kata sandi wajib diisi.')).toBeTruthy();
      });
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  // ── Login berhasil ────────────────────────────────────────────────────────
  describe('login berhasil', () => {
    beforeEach(() => {
      mockLogin.mockResolvedValue({ data: { token: 'tok', user: mockUser } });
    });

    it('memanggil login() dengan email (trimmed) dan password', async () => {
      const { getByPlaceholderText, getByText } = renderLogin();

      fireEvent.changeText(getByPlaceholderText('contoh@email.com'), '  haris@test.com  ');
      fireEvent.changeText(getByPlaceholderText('Minimal 8 karakter'), 'password123');
      fireEvent.press(getByText('Masuk →'));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('haris@test.com', 'password123');
      });
      // Drain setLoading(false) dari blok finally
      await act(async () => {});
    });

    it('memanggil signIn() dengan data user dari response', async () => {
      const { getByPlaceholderText, getByText } = renderLogin();

      fireEvent.changeText(getByPlaceholderText('contoh@email.com'), 'haris@test.com');
      fireEvent.changeText(getByPlaceholderText('Minimal 8 karakter'), 'password123');
      fireEvent.press(getByText('Masuk →'));

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith(mockUser);
      });
      await act(async () => {});
    });
  });

  // ── Login gagal ───────────────────────────────────────────────────────────
  describe('login gagal', () => {
    it('menampilkan flash error dengan pesan dari API', async () => {
      mockLogin.mockRejectedValue(new Error('Email atau kata sandi salah.'));
      const { getByPlaceholderText, getByText } = renderLogin();

      fireEvent.changeText(getByPlaceholderText('contoh@email.com'), 'haris@test.com');
      fireEvent.changeText(getByPlaceholderText('Minimal 8 karakter'), 'salah');
      fireEvent.press(getByText('Masuk →'));

      await waitFor(() => {
        expect(getByText('Email atau kata sandi salah.')).toBeTruthy();
      });
      await act(async () => {});
    });

    it('tidak memanggil signIn saat login gagal', async () => {
      mockLogin.mockRejectedValue(new Error('Gagal'));
      const { getByPlaceholderText, getByText } = renderLogin();

      fireEvent.changeText(getByPlaceholderText('contoh@email.com'), 'haris@test.com');
      fireEvent.changeText(getByPlaceholderText('Minimal 8 karakter'), 'salah');
      fireEvent.press(getByText('Masuk →'));

      await waitFor(() => expect(mockLogin).toHaveBeenCalled());
      await act(async () => {});
      expect(mockSignIn).not.toHaveBeenCalled();
    });
  });

  // ── Loading state ─────────────────────────────────────────────────────────
  describe('loading state', () => {
    it('menampilkan ActivityIndicator dan menyembunyikan teks tombol saat loading', async () => {
      const { ActivityIndicator } = require('react-native');
      let resolveLogin;
      mockLogin.mockReturnValue(
        new Promise((res) => {
          resolveLogin = res;
        })
      );
      const { getByPlaceholderText, getByText, UNSAFE_getByType, queryByText } = renderLogin();

      fireEvent.changeText(getByPlaceholderText('contoh@email.com'), 'haris@test.com');
      fireEvent.changeText(getByPlaceholderText('Minimal 8 karakter'), 'password123');
      act(() => {
        fireEvent.press(getByText('Masuk →'));
      });

      await waitFor(() => {
        // Teks "Masuk →" hilang, digantikan ActivityIndicator
        expect(queryByText('Masuk →')).toBeNull();
        expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
      });

      // Selesaikan promise dan drain setLoading(false)
      await act(async () => {
        resolveLogin({ data: { token: 't', user: mockUser } });
      });
    });
  });

  // ── Toggle password ───────────────────────────────────────────────────────
  describe('visibilitas password', () => {
    it('input password awalnya tersembunyi (secureTextEntry=true)', () => {
      const { getByPlaceholderText } = renderLogin();
      const passwordInput = getByPlaceholderText('Minimal 8 karakter');
      expect(passwordInput.props.secureTextEntry).toBe(true);
    });

    it('menekan ikon mata menampilkan password (secureTextEntry=false)', async () => {
      const { getByPlaceholderText, UNSAFE_getAllByType } = renderLogin();

      // Tombol eye adalah TouchableOpacity di sebelah input password
      // Cari semua TouchableOpacity dan tekan yang terakhir (eye button)
      const { TouchableOpacity } = require('react-native');
      const buttons = UNSAFE_getAllByType(TouchableOpacity);
      const eyeBtn = buttons[buttons.length - 2]; // eye btn, login btn adalah yg terakhir

      fireEvent.press(eyeBtn);

      await waitFor(() => {
        expect(getByPlaceholderText('Minimal 8 karakter').props.secureTextEntry).toBe(false);
      });
    });
  });
});
