// Nama ikon FontAwesome 6 yang dipakai backend tapi sudah di-rename/tidak ada
// di FontAwesome 5 Free (versi yang dipakai @expo/vector-icons di app ini).
// Tanpa alias ini, nama seperti "photo-film" akan gagal di-render dan
// memicu warning "is not a valid icon name for family FontAwesome5Free-*".
const FA6_TO_FA5_ALIASES = {
  'photo-film': 'photo-video',
};

export default function parseFaIconName(faClass, fallback = 'tag') {
  if (!faClass) return fallback;
  const m = faClass.match(/fa-(?:solid|regular|brands)\s+fa-([^\s]+)/);
  const name = m ? m[1] : faClass.match(/^fa-([^\s]+)/)?.[1];
  if (!name) return fallback;
  return FA6_TO_FA5_ALIASES[name] ?? name;
}
