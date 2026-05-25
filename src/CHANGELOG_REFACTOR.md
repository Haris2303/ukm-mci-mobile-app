# Refactor Changelog

Catatan perubahan arsitektur dan keputusan desain. File ini bukan dokumentasi API —
gunakan untuk melacak technical debt, keputusan yang disengaja, dan pekerjaan yang
ditunda.

---

## Tahap 5 — Theme Token Migration (2026-05-25)

### Token Baru Ditambahkan ke `src/theme/colors.js`

| Token | Nilai | Alasan |
|-------|-------|--------|
| `colors.brand` | `#1a4ff5` | Alias eksplisit untuk brand color UKM MCI |
| `colors.brandLight` | `#3671ff` | Lighter variant untuk gradient/hover |
| `colors.appBackground` | `#f0f4ff` | Blue-tinted page background, dipakai seluruh app |
| `colors.warningBg` | `#fef3c7` | Background card warning/tunggakan |
| `colors.warningBorder` | `#fcd34d` | Border warning |
| `colors.warningIcon` | `#fbbf24` | Icon box background warning |
| `colors.warningText` | `#92400e` | Teks primary pada surface warning |
| `colors.warningMuted` | `#a16207` | Teks secondary pada surface warning |
| `colors.infoBg` | `#eff6ff` | Background callout/instruksi |
| `colors.infoBorder` | `#bfdbfe` | Border callout/instruksi |
| `colors.infoText` | `#1e40af` | Teks dan icon callout |
| `colors.successBg` | `#f0fdf4` | Background card success/lunas |
| `colors.successBorder` | `#86efac` | Border success |
| `colors.successIconBg` | `#22c55e` | Icon box / dot background success |
| `colors.successText` | `#15803d` | Teks primary pada surface success |
| `colors.successMuted` | `#16a34a` | Teks secondary pada surface success |
| `colors.errorAccent` | `#ef4444` | Badge, dot, icon accent merah |
| `colors.errorStrong` | `#dc2626` | Teks destructive, nominal negatif |
| `colors.errorBg` | `#fee2e2` | Background chip/badge error |

### Breaking Change: `colors.primary`

**Sebelum:** `#007AFF` (iOS system blue default)
**Sesudah:** `#1a4ff5` (brand UKM MCI)

Komponen yang menggunakan `colors.primary` akan otomatis memakai warna brand.
Referensi iOS blue tetap tersedia via `colors.systemBlue = '#007AFF'`.

### File yang Direfactor (Tahap 5)

| File | Perubahan |
|------|-----------|
| `src/theme/colors.js` | Tambah 19 token baru, overwrite primary |
| `src/features/kas/screens/KasScreen.jsx` | brand, appBackground, shadow.md, spacing tokens |
| `src/features/kas/screens/TunggakanTab.jsx` | warning*, info*, success* tokens |
| `src/features/kas/screens/RiwayatTab.jsx` | warning*, success*, shadow.xs, spacing/radius tokens |
| `src/features/kas/screens/TransparansiTab.jsx` | brand, errorStrong, neutral*, shadow.xs |
| `src/features/kas/components/BreakdownRow.jsx` | CATEGORY_COLORS constant, brand/success*/error* tokens |
| `src/features/kas/components/EmptyKas.jsx` | radius.xl, spacing[8] |
| `src/features/kas/components/TunggakanItem.jsx` | surface, border, warning*, shadow.xs, radius tokens |
| `src/features/kas/components/KasRingkasanCard.jsx` | brand, warning*, success*, labelOnPrimary |

---

## Technical Debt

### TD-001: Slate/Grey Color Migration

**Status:** DITUNDA — target fase Visual Refresh

**Deskripsi:**
Codebase menggunakan dua color system paralel:
- `src/theme/colors.js` → iOS neutral scale (`#8E8E93`, `#636366`, `#1C1C1E`, dll.)
- Komponen UI (termasuk fitur kas) → Tailwind CSS slate scale (`#64748b`, `#94a3b8`, `#1e293b`, `#475569`)

Nilai-nilai ini sengaja dibiarkan hardcoded karena migrasi akan mengubah tone visual
seluruh aplikasi dan berada di luar scope Tahap 5.

**Nilai yang terdampak (per file):**

| Hex | Tailwind equiv | iOS equiv terdekat |
|-----|---------------|-------------------|
| `#64748b` | slate-500 | `colors.labelSecondary` = `#8E8E93` |
| `#94a3b8` | slate-400 | `colors.neutral400` = `#AEAEB2` |
| `#1e293b` | slate-900 | `colors.neutral900` = `#1C1C1E` |
| `#475569` | slate-600 | `colors.neutral600` = `#636366` |
| `#e2e8f0` | slate-200 | `colors.neutral200` = `#E5E5EA` |

**File yang terdampak:**
`KasScreen.jsx`, `TunggakanTab.jsx`, `RiwayatTab.jsx`, `TransparansiTab.jsx`,
`BreakdownRow.jsx`, `TunggakanItem.jsx`, `EmptyKas.jsx` (+ fitur lain yang belum diaudit)

**Aksi yang diperlukan:**
Putuskan apakah akan adopt iOS neutral scale atau tambah Tailwind-style slate tokens ke
`colors.js`. Kemudian lakukan migrasi menyeluruh dalam satu PR khusus Visual Refresh.

---

### TD-002: Nilai Off-Grid pada Spacing

**Status:** DITUNDA — biarkan sampai layout audit

**Deskripsi:**
Beberapa nilai padding/margin/gap tidak mengikuti 4-point grid system (`spacing` scale).
Nilai-nilai ini sengaja dibiarkan karena memaksakan grid akan mengubah visual komponen.

**Nilai yang sering muncul:**
`5`, `6`, `9`, `10`, `14`, `18`, `22`, `26`

---

### TD-003: Nilai BorderRadius Tanpa Token

**Status:** DITUNDA

**Deskripsi:**
Beberapa `borderRadius` tidak memiliki padanan di `radius` scale:
`9`, `11`, `16`, `18`, `24`

Nilai `13`, `36`, `65`, `90` adalah radius circular (setengah dari ukuran fixed) —
sengaja tidak dijadikan token.
