/**
 * Map detected weakness / focus tags to substrings matched against `exercises.category`
 * (seed data uses e.g. "Articulation", "Oral motor", "Breath support").
 */
export function weaknessTagToCategoryPattern(tag: string | null | undefined): string {
  if (tag == null || String(tag).trim() === '') {
    return 'articulation';
  }
  const t = tag.toLowerCase().trim();
  if (t === 'tongue') return 'oral';
  if (t === 'stammering') return 'breath';
  if (t === 'pronunciation') return 'articulation';
  return 'articulation';
}

/** Normalize optional profile.weakness (legacy text) to pronunciation | tongue | stammering */
export function profileWeaknessToTag(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const s = raw.toLowerCase().trim();
  if (s.includes('tongue') || s.includes('oral')) return 'tongue';
  if (s.includes('breath') || s.includes('stammer') || s.includes('breathing')) return 'stammering';
  if (s.includes('pronun') || s.includes('articulation') || s.includes('lip')) return 'pronunciation';
  return null;
}
