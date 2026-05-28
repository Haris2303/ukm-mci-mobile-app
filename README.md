<div align="center">

# 📱 UKM MCI App

**Sistem Manajemen Administrasi UKM MCI**

Mobile application for managing student organization (*Unit Kegiatan Mahasiswa*) administration — attendance, treasury, work programs, materials, and elections.

![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=flat-square&logo=react)
![Expo](https://img.shields.io/badge/Expo-54-000020?style=flat-square&logo=expo)
![React Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?style=flat-square&logo=reactquery)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)
![License](https://img.shields.io/badge/license-Private-red?style=flat-square)

</div>

---

## ✨ Features

| Modul | Deskripsi |
|---|---|
| 🔐 **Login** | Autentikasi dengan email & kata sandi. Inline flash message animasi untuk validasi dan error. |
| 🏠 **Home** | Dashboard menu utama dengan shortcut ke semua fitur. |
| 📷 **Presensi** | Scan QR code kehadiran menggunakan kamera. Riwayat presensi lengkap. |
| 💰 **E-Kas** | Transparansi keuangan, riwayat pembayaran, dan daftar tunggakan kas. |
| 📚 **Materi** | Daftar materi belajar per divisi & umum. Download materi langsung ke perangkat. |
| 📋 **Proker** | Program kerja UKM lengkap dengan detail tugas, progress, dan status. |
| 🗳️ **Voting** | Pemilihan pengurus secara digital — list pemilihan, detail kandidat, dan hasil voting. |
| 👤 **Profil** | Biodata anggota, ganti avatar, ganti kata sandi, dan ID Card digital. |

---

## 🎯 Screenshots

> *Coming soon — screenshots akan ditambahkan setelah build release pertama.*

---

## 🛠️ Tech Stack

### Core
- **[React Native 0.81](https://reactnative.dev/)** — framework mobile cross-platform
- **[Expo SDK 54](https://expo.dev/)** — toolchain & managed workflow
- **[React 19](https://react.dev/)** — dengan React Compiler aktif

### Navigation
- **[React Navigation 7](https://reactnavigation.org/)** — Native Stack + Bottom Tabs

### Server State
- **[TanStack Query v5](https://tanstack.com/query)** — fetching, caching, dan sinkronisasi data server

### UI & Styling
- **[Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)** — gradient card & header
- **[React Native SVG](https://github.com/software-mansion/react-native-svg)** — SVG gradients
- **[FontAwesome5](https://github.com/oblador/react-native-vector-icons)** — ikon konsisten
- **Design Token System** — semua warna terpusat di `src/theme/colors.js`

### Media & File
- **[Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)** — scan QR code presensi
- **[Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)** — upload avatar
- **[Expo File System](https://docs.expo.dev/versions/latest/sdk/filesystem/)** — download materi
- **[Expo Sharing](https://docs.expo.dev/versions/latest/sdk/sharing/)** — share ID Card
- **[React Native QR Code SVG](https://github.com/awesomejerry/react-native-qrcode-svg)** — render QR pada ID Card
- **[React Native View Shot](https://github.com/gre/react-native-view-shot)** — capture ID Card sebagai gambar

### Code Quality
- **[ESLint](https://eslint.org/)** — linting dengan rules React, React Native, dan import
- **[Prettier](https://prettier.io/)** — code formatting konsisten
- **[Husky](https://typicode.github.io/husky/)** + **[lint-staged](https://github.com/lint-staged/lint-staged)** — pre-commit hook otomatis

---

## 📁 Project Structure

```
ukm-mci-app/
├── src/
│   ├── components/          # Shared UI components
│   │   └── ui/              # Base components (Button, Card, Icon, …)
│   ├── context/             # React Context (AuthContext)
│   ├── core/
│   │   ├── api/             # Axios client & response handler
│   │   └── query/           # TanStack Query client setup
│   ├── features/            # Feature-based modules
│   │   ├── kas/             # E-Kas (api, components, hooks, screens, styles)
│   │   ├── materi/          # Materi (hooks, services)
│   │   ├── presensi/        # Presensi (hooks)
│   │   ├── profile/         # Profile (hooks)
│   │   ├── proker/          # Proker (hooks)
│   │   └── voting/          # Voting (hooks)
│   ├── navigation/          # Stack & tab navigators
│   ├── screens/             # Screen components per route
│   │   ├── home/
│   │   ├── login/
│   │   ├── materi/
│   │   ├── presensi/
│   │   ├── profile/
│   │   ├── proker/
│   │   └── voting/
│   ├── services/            # API service functions
│   └── theme/
│       └── colors.js        # 🎨 Single source of truth untuk semua warna
├── assets/                  # Logo, fonts, images
├── .eslintrc.js
├── .prettierrc.js
├── babel.config.js          # Path aliases (@features, @theme, @shared, …)
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`
- Android Studio / Xcode (untuk emulator) **atau** aplikasi [Expo Go](https://expo.dev/go) di HP

### Installation

```bash
# 1. Clone repository
git clone <repo-url>
cd ukm-mci-app

# 2. Install dependencies
npm install

# 3. Jalankan development server
npm start
```

### Menjalankan di perangkat

```bash
# Android
npm run android

# iOS
npm run ios

# Scan QR di Expo Go (HP fisik)
npm start
```

---

## 🔧 Code Quality

### Lint & Format

```bash
# Cek semua pelanggaran lint
npm run lint

# Auto-fix lint errors
npm run lint:fix

# Format seluruh kode
npm run format
```

### Pre-commit Hook

Setiap commit otomatis menjalankan **ESLint fix** + **Prettier** via Husky:

```
git commit  →  lint-staged  →  eslint --fix  →  prettier --write  →  commit ✅
```

### Design Token

Semua warna wajib menggunakan token dari `src/theme/colors.js` — tidak ada hardcoded hex/rgba di file komponen maupun style.

```js
// ✅ Benar
color: colors.slate800

// ❌ Salah
color: '#1e293b'
```

---

## 🗂️ Path Aliases

| Alias | Path |
|---|---|
| `@features/*` | `src/features/*` |
| `@theme/*` | `src/theme/*` |
| `@shared/*` | `src/shared/*` |
| `@context/*` | `src/context/*` |
| `@core/*` | `src/core/*` |

---

## 📌 Changelog

### v1.0.0 — Initial Release
- Seluruh fitur utama: Login, Home, Presensi, E-Kas, Materi, Proker, Voting, Profil
- Arsitektur feature-based modular
- Design token system (`colors.js`)
- Animated inline flash message pada login screen
- Code quality toolchain: ESLint + Prettier + Husky

---

## 👤 Author

**Haris** — [@haris2303](https://github.com/haris2303)

> Dibuat sebagai bagian dari skripsi pengembangan sistem manajemen administrasi UKM berbasis mobile.

---

<div align="center">
  <sub>Built with ❤️ using React Native & Expo</sub>
</div>
