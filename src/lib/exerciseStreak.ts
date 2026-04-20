/** localStorage-backed consecutive-day streak when user completes ≥1 exercise per day */

const key = (userId: string) => `carevoice_daily_exercise_streak_${userId}`;

type StreakState = {
  lastActiveDate: string; // YYYY-MM-DD
  streak: number;
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function readExerciseStreak(userId: string): number {
  try {
    const raw = localStorage.getItem(key(userId));
    if (!raw) return 0;
    const s = JSON.parse(raw) as StreakState;
    return typeof s.streak === 'number' ? s.streak : 0;
  } catch {
    return 0;
  }
}

/** Call after user completes at least one exercise today. Returns new streak count. */
export function recordExerciseActiveDay(userId: string): number {
  const today = todayKey();
  const yesterday = yesterdayKey();
  let streak = 1;
  let lastActiveDate = '';

  try {
    const raw = localStorage.getItem(key(userId));
    if (raw) {
      const s = JSON.parse(raw) as StreakState;
      streak = typeof s.streak === 'number' ? s.streak : 1;
      lastActiveDate = s.lastActiveDate ?? '';
    }
  } catch {
    /* ignore */
  }

  if (lastActiveDate === today) {
    return streak;
  }

  if (lastActiveDate === yesterday) {
    streak = streak + 1;
  } else {
    streak = 1;
  }

  const next: StreakState = { lastActiveDate: today, streak };
  localStorage.setItem(key(userId), JSON.stringify(next));
  return streak;
}
