// Therapy Mode Configuration
// Defines different exercise styles, feedback wording, and difficulty logic for each mode

export type TherapyMode = 'pronunciation' | 'fluency' | 'child_development' | 'accent' | 'vocabulary' | 'confidence';

export interface TherapyModeConfig {
  id: TherapyMode;
  name: string;
  description: string;
  icon: string;
  color: string;
  // Exercise types prioritized for this mode
  exerciseTypes: string[];
  // Goals that map to this mode
  mappedGoals: string[];
  // Difficulty thresholds (score thresholds for mastery)
  difficultyThresholds: {
    excellent: number;
    good: number;
    needsPractice: number;
  };
  // Feedback wording customization
  feedbackLabels: {
    excellent: string;
    great: string;
    good: string;
    keepTrying: string;
    needsWork: string;
  };
  // Encouragement messages
  encouragements: string[];
  // Tips specific to this mode
  tips: string[];
}

export const THERAPY_MODES: Record<TherapyMode, TherapyModeConfig> = {
  pronunciation: {
    id: 'pronunciation',
    name: 'Pronunciation Clarity',
    description: 'Focus on clear articulation and sound production',
    icon: '🗣️',
    color: 'from-blue-500/20 to-cyan-500/20',
    exerciseTypes: ['pronunciation', 'word_repetition', 'tongue_twister', 'syllable_drill', 'minimal_pairs'],
    mappedGoals: ['pronunciation', 'vocabulary'],
    difficultyThresholds: {
      excellent: 90,
      good: 75,
      needsPractice: 60,
    },
    feedbackLabels: {
      excellent: 'Crystal Clear! 🎯',
      great: 'Very Clear!',
      good: 'Good Clarity!',
      keepTrying: 'Getting Clearer!',
      needsWork: 'Keep Practicing!',
    },
    encouragements: [
      'Your pronunciation is improving with every practice!',
      'Each word you master builds your confidence.',
      'Clear speech opens doors to better communication.',
      'Focus on one sound at a time for best results.',
    ],
    tips: [
      'Watch your mouth movements in a mirror while practicing.',
      'Break difficult words into syllables.',
      'Practice tongue placement for tricky consonants.',
      'Record yourself and listen back to identify areas to improve.',
      'Focus on the sounds that feel most challenging first.',
    ],
  },
  fluency: {
    id: 'fluency',
    name: 'Stammering & Fluency',
    description: 'Build smooth, flowing speech patterns',
    icon: '🌊',
    color: 'from-purple-500/20 to-pink-500/20',
    exerciseTypes: ['breathing', 'sentence_reading', 'word_repetition', 'intonation'],
    mappedGoals: ['fluency', 'confidence'],
    difficultyThresholds: {
      excellent: 85,
      good: 70,
      needsPractice: 55,
    },
    feedbackLabels: {
      excellent: 'Flowing Smoothly! 🌊',
      great: 'Great Flow!',
      good: 'Nice Rhythm!',
      keepTrying: 'Building Momentum!',
      needsWork: 'Take Your Time!',
    },
    encouragements: [
      'Smooth speech comes with patience and practice.',
      'Every breath you take helps your fluency.',
      'It\'s okay to slow down - clarity matters more than speed.',
      'You\'re building stronger speech patterns each day.',
    ],
    tips: [
      'Take a deep breath before starting to speak.',
      'Use "easy onset" - start sounds gently.',
      'Pause at natural breaks in sentences.',
      'Practice with a metronome to maintain steady rhythm.',
      'Visualize the words before speaking them.',
      'Speak at a comfortable pace, not too fast.',
    ],
  },
  child_development: {
    id: 'child_development',
    name: 'Child Speech Development',
    description: 'Fun, engaging exercises for young learners',
    icon: '🧒',
    color: 'from-amber-500/20 to-orange-500/20',
    exerciseTypes: ['pronunciation', 'word_repetition', 'syllable_drill', 'sentence_reading'],
    mappedGoals: ['child_development'],
    difficultyThresholds: {
      excellent: 80,
      good: 65,
      needsPractice: 50,
    },
    feedbackLabels: {
      excellent: 'Super Star! ⭐',
      great: 'Awesome Job!',
      good: 'Great Work!',
      keepTrying: 'You Can Do It!',
      needsWork: 'Try Again, Champ!',
    },
    encouragements: [
      'You\'re doing amazing! Keep it up! 🌟',
      'Every word you learn is a superpower!',
      'Practice makes you a speech superhero!',
      'You\'re getting better and better!',
    ],
    tips: [
      'Make it fun with animal sounds and games!',
      'Practice with favorite books and stories.',
      'Sing songs to improve speech rhythm.',
      'Use a mirror to watch funny face movements.',
      'Celebrate every small improvement!',
      'Practice with family members for extra fun.',
    ],
  },
  accent: {
    id: 'accent',
    name: 'Accent Improvement',
    description: 'Refine intonation and speech patterns',
    icon: '🌍',
    color: 'from-emerald-500/20 to-teal-500/20',
    exerciseTypes: ['intonation', 'minimal_pairs', 'sentence_reading', 'word_repetition'],
    mappedGoals: ['accent'],
    difficultyThresholds: {
      excellent: 88,
      good: 72,
      needsPractice: 58,
    },
    feedbackLabels: {
      excellent: 'Native-Like! 🌟',
      great: 'Excellent Accent!',
      good: 'Good Progress!',
      keepTrying: 'Keep Refining!',
      needsWork: 'Keep Listening!',
    },
    encouragements: [
      'Your accent is becoming more natural!',
      'Listen closely to patterns and rhythms.',
      'Intonation makes all the difference.',
      'You\'re developing an ear for the language!',
    ],
    tips: [
      'Listen to native speakers regularly.',
      'Focus on stressed syllables in words.',
      'Practice word linking in connected speech.',
      'Mimic the rhythm and melody of speech.',
      'Record and compare with native examples.',
      'Pay attention to vowel length differences.',
    ],
  },
  vocabulary: {
    id: 'vocabulary',
    name: 'Vocabulary Building',
    description: 'Learn and practice new words and their usage',
    icon: '📚',
    color: 'from-blue-500/20 to-cyan-500/20',
    exerciseTypes: ['word_repetition', 'pronunciation', 'minimal_pairs'],
    mappedGoals: ['vocabulary', 'pronunciation'],
    difficultyThresholds: {
      excellent: 90,
      good: 75,
      needsPractice: 60,
    },
    feedbackLabels: {
      excellent: 'Word Master! 📚',
      great: 'Great Vocabulary!',
      good: 'Well Spoken!',
      keepTrying: 'Expanding Your Lexicon!',
      needsWork: 'Keep Practicing!',
    },
    encouragements: [
      'Each new word is a building block for better communication.',
      'Your vocabulary is growing day by day!',
      'Confidence starts with the right words.',
    ],
    tips: [
      'Try using your new words in daily conversation.',
      'Group related words together to remember them better.',
      'Practice the pronunciation and the meaning together.',
    ],
  },
  confidence: {
    id: 'confidence',
    name: 'Slow Speech Confidence',
    description: 'Build confidence through controlled, steady speech',
    icon: '💪',
    color: 'from-purple-500/20 to-pink-500/20',
    exerciseTypes: ['breathing', 'intonation', 'sentence_reading'],
    mappedGoals: ['confidence', 'fluency'],
    difficultyThresholds: {
      excellent: 85,
      good: 70,
      needsPractice: 55,
    },
    feedbackLabels: {
      excellent: 'Total Confidence! 💪',
      great: 'Steady and Strong!',
      good: 'Nice Control!',
      keepTrying: 'Finding Your Voice!',
      needsWork: 'Take Your Time!',
    },
    encouragements: [
      'Confidence is the result of consistent practice.',
      'You are speaking with more authority every day.',
      'Believe in your voice - it matters!',
    ],
    tips: [
      'Maintain good posture while speaking.',
      'Speak slowly and intentionally.',
      'Look into the mirror and practice speaking with a smile.',
    ],
  },
};

// Get feedback label based on score and mode
export const getFeedbackLabel = (score: number, mode: TherapyMode): string => {
  const config = THERAPY_MODES[mode];
  if (score >= config.difficultyThresholds.excellent) return config.feedbackLabels.excellent;
  if (score >= config.difficultyThresholds.good) return config.feedbackLabels.great;
  if (score >= config.difficultyThresholds.needsPractice) return config.feedbackLabels.good;
  if (score >= config.difficultyThresholds.needsPractice - 15) return config.feedbackLabels.keepTrying;
  return config.feedbackLabels.needsWork;
};

// Get random encouragement for mode
export const getEncouragement = (mode: TherapyMode): string => {
  const encouragements = THERAPY_MODES[mode].encouragements;
  return encouragements[Math.floor(Math.random() * encouragements.length)];
};

// Get random tip for mode
export const getTip = (mode: TherapyMode): string => {
  const tips = THERAPY_MODES[mode].tips;
  return tips[Math.floor(Math.random() * tips.length)];
};

// Get exercise types for mode
export const getExerciseTypesForMode = (mode: TherapyMode): string[] => {
  return THERAPY_MODES[mode].exerciseTypes;
};

// Determine if score is considered "mastered" for the mode
export const isMasteredInMode = (score: number, mode: TherapyMode): boolean => {
  return score >= THERAPY_MODES[mode].difficultyThresholds.excellent;
};

// Get mode from user goals (for backward compatibility)
export const getModeFromGoals = (goals: string[] | null): TherapyMode => {
  if (!goals || goals.length === 0) return 'pronunciation';
  
  // Check for direct matches
  if (goals.includes('fluency')) return 'fluency';
  if (goals.includes('child_development')) return 'child_development';
  if (goals.includes('accent')) return 'accent';
  
  // Default to pronunciation
  return 'pronunciation';
};

// Get all modes as array for UI
export const getAllModes = (): TherapyModeConfig[] => {
  return Object.values(THERAPY_MODES);
};
