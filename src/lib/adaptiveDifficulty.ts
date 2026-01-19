import { supabase } from '@/integrations/supabase/client';

export interface ExerciseProgress {
  exercise_text: string;
  phoneme_pattern: string | null;
  mastery_status: 'weak' | 'learning' | 'mastered';
  total_attempts: number;
  average_score: number;
}

export interface DifficultyProgress {
  current_difficulty: 'beginner' | 'moderate' | 'severe';
  avg_session_score: number;
  total_mastered: number;
  total_weak: number;
  sessions_at_current_level: number;
}

// Extract phoneme patterns from exercise text
export const extractPhonemePattern = (text: string): string => {
  const lowerText = text.toLowerCase();
  const patterns: string[] = [];
  
  // Common difficult phoneme patterns
  const phonemePatterns: Record<string, RegExp> = {
    'th': /th/g,
    'sh': /sh/g,
    'ch': /ch/g,
    'str': /str/g,
    'spl': /spl/g,
    'scr': /scr/g,
    'r_blend': /[bcdfgpt]r/g,
    'l_blend': /[bcfgps]l/g,
    'ng': /ng/g,
    'nk': /nk/g,
    'tion': /tion/g,
    'ough': /ough/g,
  };
  
  for (const [name, regex] of Object.entries(phonemePatterns)) {
    if (regex.test(lowerText)) {
      patterns.push(name);
    }
  }
  
  return patterns.length > 0 ? patterns.join(',') : 'basic';
};

// Determine mastery status based on score
export const getMasteryStatus = (score: number): 'weak' | 'learning' | 'mastered' => {
  if (score > 85) return 'mastered';
  if (score >= 60) return 'learning';
  return 'weak';
};

// Update exercise progress after a result
export const updateExerciseProgress = async (
  userId: string,
  exerciseText: string,
  score: number
): Promise<void> => {
  const masteryStatus = getMasteryStatus(score);
  const phonemePattern = extractPhonemePattern(exerciseText);
  
  // Try to get existing progress
  const { data: existing } = await supabase
    .from('user_exercise_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('exercise_text', exerciseText)
    .maybeSingle();
  
  if (existing) {
    // Update existing progress
    const newTotalAttempts = (existing.total_attempts || 0) + 1;
    const newSuccessful = score >= 60 
      ? (existing.successful_attempts || 0) + 1 
      : (existing.successful_attempts || 0);
    const newAvgScore = ((Number(existing.average_score) || 0) * (existing.total_attempts || 0) + score) / newTotalAttempts;
    
    // Mastery status can improve or decline
    let newMasteryStatus = masteryStatus;
    if (newAvgScore > 85 && newSuccessful >= 3) {
      newMasteryStatus = 'mastered';
    } else if (newAvgScore >= 60) {
      newMasteryStatus = 'learning';
    } else {
      newMasteryStatus = 'weak';
    }
    
    await supabase
      .from('user_exercise_progress')
      .update({
        total_attempts: newTotalAttempts,
        successful_attempts: newSuccessful,
        average_score: Math.round(newAvgScore * 100) / 100,
        mastery_status: newMasteryStatus,
        phoneme_pattern: phonemePattern,
        last_practiced_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
  } else {
    // Create new progress record
    await supabase
      .from('user_exercise_progress')
      .insert({
        user_id: userId,
        exercise_text: exerciseText,
        phoneme_pattern: phonemePattern,
        mastery_status: masteryStatus,
        total_attempts: 1,
        successful_attempts: score >= 60 ? 1 : 0,
        average_score: score,
      });
  }
};

// Get user's weak phoneme patterns
export const getWeakPhonemePatterns = async (userId: string): Promise<string[]> => {
  const { data } = await supabase
    .from('user_exercise_progress')
    .select('phoneme_pattern')
    .eq('user_id', userId)
    .eq('mastery_status', 'weak');
  
  if (!data || data.length === 0) return [];
  
  // Count pattern occurrences
  const patternCounts = new Map<string, number>();
  data.forEach(row => {
    if (row.phoneme_pattern) {
      row.phoneme_pattern.split(',').forEach(p => {
        patternCounts.set(p, (patternCounts.get(p) || 0) + 1);
      });
    }
  });
  
  // Sort by count and return top patterns
  return Array.from(patternCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([pattern]) => pattern);
};

// Update difficulty progression after a session
export const updateDifficultyProgression = async (
  userId: string,
  sessionScore: number
): Promise<void> => {
  // Get current progress
  const { data: existing } = await supabase
    .from('user_difficulty_progress')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  // Count mastered and weak exercises
  const { count: masteredCount } = await supabase
    .from('user_exercise_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('mastery_status', 'mastered');
  
  const { count: weakCount } = await supabase
    .from('user_exercise_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('mastery_status', 'weak');
  
  if (existing) {
    const sessionsAtLevel = (existing.sessions_at_current_level || 0) + 1;
    const newAvgScore = ((Number(existing.avg_session_score) || 0) * (sessionsAtLevel - 1) + sessionScore) / sessionsAtLevel;
    
    // Determine if difficulty should change
    let newDifficulty = existing.current_difficulty as 'beginner' | 'moderate' | 'severe';
    let shouldAdjust = false;
    
    // Increase difficulty: High avg score over multiple sessions
    if (sessionsAtLevel >= 3 && newAvgScore > 85 && (masteredCount || 0) >= 5) {
      if (newDifficulty === 'beginner') {
        newDifficulty = 'moderate';
        shouldAdjust = true;
      } else if (newDifficulty === 'moderate') {
        newDifficulty = 'severe';
        shouldAdjust = true;
      }
    }
    
    // Decrease difficulty: Low avg score over multiple sessions
    if (sessionsAtLevel >= 3 && newAvgScore < 50 && (weakCount || 0) >= 5) {
      if (newDifficulty === 'severe') {
        newDifficulty = 'moderate';
        shouldAdjust = true;
      } else if (newDifficulty === 'moderate') {
        newDifficulty = 'beginner';
        shouldAdjust = true;
      }
    }
    
    await supabase
      .from('user_difficulty_progress')
      .update({
        avg_session_score: Math.round(newAvgScore * 100) / 100,
        total_mastered: masteredCount || 0,
        total_weak: weakCount || 0,
        sessions_at_current_level: shouldAdjust ? 1 : sessionsAtLevel,
        current_difficulty: newDifficulty,
        difficulty_adjusted_at: shouldAdjust ? new Date().toISOString() : existing.difficulty_adjusted_at,
      })
      .eq('id', existing.id);
    
    // Also update profile difficulty if it changed
    if (shouldAdjust) {
      await supabase
        .from('profiles')
        .update({ difficulty: newDifficulty })
        .eq('user_id', userId);
    }
  } else {
    // Create new progression record
    await supabase
      .from('user_difficulty_progress')
      .insert({
        user_id: userId,
        current_difficulty: 'beginner',
        avg_session_score: sessionScore,
        total_mastered: masteredCount || 0,
        total_weak: weakCount || 0,
        sessions_at_current_level: 1,
      });
  }
};

// Get user's difficulty progress for exercise selection
export const getUserDifficultyProgress = async (userId: string): Promise<DifficultyProgress | null> => {
  const { data } = await supabase
    .from('user_difficulty_progress')
    .select('current_difficulty, avg_session_score, total_mastered, total_weak, sessions_at_current_level')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (!data) return null;
  
  return {
    current_difficulty: data.current_difficulty as 'beginner' | 'moderate' | 'severe',
    avg_session_score: Number(data.avg_session_score) || 0,
    total_mastered: data.total_mastered || 0,
    total_weak: data.total_weak || 0,
    sessions_at_current_level: data.sessions_at_current_level || 0,
  };
};

// Get weak exercises to prioritize
export const getWeakExercises = async (userId: string): Promise<string[]> => {
  const { data } = await supabase
    .from('user_exercise_progress')
    .select('exercise_text')
    .eq('user_id', userId)
    .eq('mastery_status', 'weak')
    .order('average_score', { ascending: true })
    .limit(10);
  
  return data?.map(d => d.exercise_text) || [];
};

// Get mastered exercises to avoid repeating
export const getMasteredExercises = async (userId: string): Promise<string[]> => {
  const { data } = await supabase
    .from('user_exercise_progress')
    .select('exercise_text')
    .eq('user_id', userId)
    .eq('mastery_status', 'mastered');
  
  return data?.map(d => d.exercise_text) || [];
};
