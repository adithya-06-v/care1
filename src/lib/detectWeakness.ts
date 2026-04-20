/**
 * Rule-based weakness detection from session-style metrics.
 * Replace with model inference later while keeping the same return tags.
 */

export interface WeaknessProgressData {
  pronunciation_score: number;
  fluency_score: number;
  tongue_control: number;
}

export function detectWeakness(progressData: WeaknessProgressData): string {
  if (progressData.pronunciation_score < 50) return 'pronunciation';
  if (progressData.fluency_score < 50) return 'stammering';
  if (progressData.tongue_control < 50) return 'tongue';
  return 'pronunciation';
}

type SessionRow = {
  accuracy_score: number | string | null;
  exercises_completed: number | null;
};

/** Derive scores for detectWeakness from therapy sessions + profile mode. */
export function buildProgressDataFromSessions(
  sessions: SessionRow[],
  therapyMode: string | null | undefined,
): WeaknessProgressData {
  const withEx = sessions.filter((s) => (s.exercises_completed ?? 0) > 0);
  const avg =
    withEx.length === 0
      ? 45
      : withEx.reduce((sum, s) => sum + Number(s.accuracy_score ?? 0), 0) / withEx.length;

  const rounded = Math.round(Math.min(100, Math.max(0, avg)));

  const pronunciation_score = rounded;
  const fluency_score = therapyMode === 'fluency' ? rounded : 72;
  const tongue_control = 68;

  return { pronunciation_score, fluency_score, tongue_control };
}
