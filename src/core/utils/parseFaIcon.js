export default function parseFaIconName(faClass, fallback = 'tag') {
  if (!faClass) return fallback;
  const m = faClass.match(/fa-(?:solid|regular|brands)\s+fa-([^\s]+)/);
  if (m) return m[1];
  const s = faClass.match(/^fa-([^\s]+)/);
  return s ? s[1] : fallback;
}
