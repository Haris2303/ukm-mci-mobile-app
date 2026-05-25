export const ENDPOINTS = {
  AUTH: {
    LOGIN:  '/auth/login',
    LOGOUT: '/auth/logout',
  },

  PRESENSI: {
    CATAT:   '/presensi',
    RIWAYAT: '/presensi/riwayat',
  },

  KAS: {
    TUNGGAKAN: '/kas/tunggakan',
    RIWAYAT:   '/kas/riwayat',
    SALDO:     '/kas/saldo-transparansi',
  },

  MATERI: {
    LIST: '/materi',
  },

  PROKER: {
    LIST:   '/proker',
    DETAIL: (id) => `/proker/${id}`,
  },

  ELECTIONS: {
    LIST:   '/elections',
    DETAIL: (id) => `/elections/${id}`,
    VOTE:   (id) => `/elections/${id}/vote`,
    HASIL:  (id) => `/elections/${id}/hasil`,
  },

  PROFILE: {
    GET:      '/profile',
    AVATAR:   '/profile/avatar',
    PASSWORD: '/profile/password',
  },

  ID_CARD: {
    ME:      '/id-card/me',
    BY_USER: (userId) => `/id-card/${userId}`,
  },
};
