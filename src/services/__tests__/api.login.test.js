/**
 * Unit test — src/services/api.js : login()
 *
 * Cakupan:
 *   - Mengirim POST ke endpoint yang benar dengan body yang benar
 *   - Menyimpan token ke AsyncStorage setelah login berhasil
 *   - Menyimpan data user ke AsyncStorage setelah login berhasil
 *   - Mengembalikan data response dari server
 *   - Melempar error saat server mengembalikan respons gagal
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { login } from '../api';

// ── Mock dependencies ──────────────────────────────────────────────────────
jest.mock('@config/apiConfig', () => ({ BASE_URL: 'http://test.local/api' }));

// handleResponse di-proxy dari core — mock sumber aslinya
jest.mock('@core/api/handleResponse', () => ({
  handleResponse: jest.fn(),
  setSignOutHandler: jest.fn(),
}));

const { handleResponse } = require('@core/api/handleResponse');

// ── Helpers ────────────────────────────────────────────────────────────────
const mockUser = { id: 1, nama: 'Haris', email: 'haris@test.com', avatar: null };
const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';
const mockResponse = { data: { token: mockToken, user: mockUser } };

function buildFetchMock(status = 200, body = mockResponse) {
  return jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(body),
  });
}

// ── Tests ──────────────────────────────────────────────────────────────────
describe('login()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
    handleResponse.mockResolvedValue(mockResponse);
    global.fetch = buildFetchMock();
  });

  it('mengirim POST ke endpoint /auth/login', async () => {
    await login('haris@test.com', 'password123');

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe('http://test.local/api/auth/login');
    expect(options.method).toBe('POST');
  });

  it('mengirim email dan password di request body', async () => {
    await login('haris@test.com', 'secret99');

    const [, options] = global.fetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body).toEqual({ email: 'haris@test.com', password: 'secret99' });
  });

  it('menyimpan token ke AsyncStorage setelah berhasil', async () => {
    await login('haris@test.com', 'password123');

    const stored = await AsyncStorage.getItem('auth_token');
    expect(stored).toBe(mockToken);
  });

  it('menyimpan data user (JSON) ke AsyncStorage setelah berhasil', async () => {
    await login('haris@test.com', 'password123');

    const stored = await AsyncStorage.getItem('auth_user');
    expect(JSON.parse(stored)).toEqual(mockUser);
  });

  it('mengembalikan data response dari server', async () => {
    const result = await login('haris@test.com', 'password123');

    expect(result).toEqual(mockResponse);
  });

  it('melempar error saat handleResponse melempar (respons gagal)', async () => {
    const apiError = new Error('Email atau kata sandi salah.');
    apiError.status = 422;
    handleResponse.mockRejectedValue(apiError);

    await expect(login('salah@test.com', 'salah')).rejects.toThrow('Email atau kata sandi salah.');
  });

  it('tidak menyimpan apapun ke AsyncStorage saat login gagal', async () => {
    handleResponse.mockRejectedValue(new Error('Gagal'));

    await expect(login('a@b.com', 'x')).rejects.toThrow();

    expect(await AsyncStorage.getItem('auth_token')).toBeNull();
    expect(await AsyncStorage.getItem('auth_user')).toBeNull();
  });
});
