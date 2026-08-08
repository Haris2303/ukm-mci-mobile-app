/**
 * Unit test — src/context/AuthContext.js
 *
 * Cakupan:
 *   - signIn menyimpan user ke state
 *   - signIn menyimpan avatar bila userData.avatar ada
 *   - signOut menghapus user dan avatar dari state
 *   - signOut memanggil apiLogout
 *   - signOut membersihkan cache React Query (agar data user lama tidak
 *     nyangkut saat user lain login di sesi yang sama)
 *   - Saat mount: load user dari storage jika sudah login
 *   - Saat mount: tidak set user jika belum login
 */

import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';

import { AuthProvider, useAuth } from '../AuthContext';

// ── Mock dependencies ──────────────────────────────────────────────────────
const mockApiLogout = jest.fn().mockResolvedValue(undefined);
const mockGetStoredUser = jest.fn();
const mockIsLoggedIn = jest.fn();

jest.mock('@services/api', () => ({
  logout: (...args) => mockApiLogout(...args),
  getStoredUser: (...args) => mockGetStoredUser(...args),
  isLoggedIn: (...args) => mockIsLoggedIn(...args),
}));

jest.mock('@core/api/handleResponse', () => ({
  handleResponse: jest.fn(),
  setSignOutHandler: jest.fn(),
}));

const mockQueryClientClear = jest.fn();
jest.mock('@core/query/queryClient', () => ({
  queryClient: { clear: (...args) => mockQueryClientClear(...args) },
}));

// ── Helper wrapper ─────────────────────────────────────────────────────────
const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

const mockUser = { id: 1, nama: 'Haris', email: 'haris@test.com', avatar: null };
const mockUserWithAvatar = { ...mockUser, avatar: 'data:image/png;base64,abc' };

// ── Tests ──────────────────────────────────────────────────────────────────
describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsLoggedIn.mockResolvedValue(false);
    mockGetStoredUser.mockResolvedValue(null);
  });

  describe('signIn()', () => {
    it('menyimpan data user ke context', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        result.current.signIn(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
    });

    it('menyimpan avatar jika userData.avatar tersedia', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        result.current.signIn(mockUserWithAvatar);
      });

      expect(result.current.avatar).toBe(mockUserWithAvatar.avatar);
    });

    it('avatar tetap null jika userData.avatar tidak ada', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        result.current.signIn(mockUser);
      });

      expect(result.current.avatar).toBeNull();
    });
  });

  describe('signOut()', () => {
    it('menghapus user dari context', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        result.current.signIn(mockUser);
      });
      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.user).toBeNull();
    });

    it('menghapus avatar dari context', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        result.current.signIn(mockUserWithAvatar);
      });
      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.avatar).toBeNull();
    });

    it('memanggil apiLogout', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.signOut();
      });

      expect(mockApiLogout).toHaveBeenCalledTimes(1);
    });

    it('membersihkan cache React Query supaya data user lama tidak nyangkut', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        result.current.signIn(mockUser);
      });
      await act(async () => {
        await result.current.signOut();
      });

      expect(mockQueryClientClear).toHaveBeenCalledTimes(1);
    });
  });

  describe('inisialisasi saat mount', () => {
    it('memuat user dari storage jika sudah login sebelumnya', async () => {
      mockIsLoggedIn.mockResolvedValue(true);
      mockGetStoredUser.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.user).toEqual(mockUser);
    });

    it('tidak memuat user jika belum pernah login', async () => {
      mockIsLoggedIn.mockResolvedValue(false);

      const { result } = renderHook(() => useAuth(), { wrapper });
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.user).toBeNull();
    });

    it('loading berubah jadi false setelah inisialisasi selesai', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.loading).toBe(false);
    });
  });
});
