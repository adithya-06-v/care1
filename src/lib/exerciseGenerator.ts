// Exercise types
export interface Exercise {
  id: string;
  type: 'pronunciation' | 'breathing' | 'tongue_twister' | 'word_repetition' | 'sentence_reading' | 'minimal_pairs' | 'syllable_drill' | 'intonation';
  title: string;
  instruction: string;
  content: string;
  difficulty: 'beginner' | 'moderate' | 'severe';
  targetGoal: string;
  ageGroup?: string;
}

// Exercise banks by category
const pronunciationExercises: Omit<Exercise, 'id'>[] = [
  // Beginner - Words
  { type: 'word_repetition', title: 'Simple Sounds', instruction: 'Repeat each word slowly and clearly', content: 'Cat, Dog, Sun, Moon, Ball', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'pronunciation', title: 'Vowel Practice', instruction: 'Say each vowel sound three times', content: 'A - E - I - O - U', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'syllable_drill', title: 'Two Syllable Words', instruction: 'Break these words into syllables as you say them', content: 'Hap-py, Ta-ble, Win-dow, Ap-ple, Mon-key', difficulty: 'beginner', targetGoal: 'pronunciation' },
  // Beginner - Sentences
  { type: 'sentence_reading', title: 'Simple Sentence', instruction: 'Read this sentence clearly', content: 'The cat sat on the mat', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Basic Greeting', instruction: 'Practice this common greeting', content: 'Hello, how are you today', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Daily Sentence', instruction: 'Read naturally and clearly', content: 'I like to eat apples and bananas', difficulty: 'beginner', targetGoal: 'pronunciation' },
  // Moderate - Words
  { type: 'tongue_twister', title: 'Tongue Twister', instruction: 'Read slowly first, then increase speed', content: 'She sells seashells by the seashore', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Complex Sounds', instruction: 'Focus on the highlighted sounds', content: 'Strength, Rhythm, Twelfth, Clothes, Months', difficulty: 'moderate', targetGoal: 'pronunciation' },
  // Moderate - Sentences
  { type: 'sentence_reading', title: 'Sentence Flow', instruction: 'Read naturally with proper pauses', content: 'The quick brown fox jumps over the lazy dog', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Descriptive Sentence', instruction: 'Focus on clear pronunciation of each word', content: 'The beautiful garden has many colorful flowers', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Action Sentence', instruction: 'Maintain a steady pace throughout', content: 'She quickly ran to catch the bus before it left', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Question Practice', instruction: 'Use proper rising intonation for questions', content: 'Would you like to come with me to the store', difficulty: 'moderate', targetGoal: 'pronunciation' },
  // Severe - Words
  { type: 'tongue_twister', title: 'Advanced Tongue Twister', instruction: 'Master this challenging phrase', content: 'Peter Piper picked a peck of pickled peppers', difficulty: 'severe', targetGoal: 'pronunciation' },
  { type: 'pronunciation', title: 'Consonant Clusters', instruction: 'Practice these difficult consonant combinations', content: 'Strengths, Glimpsed, Sculpts, Twelfths, Prompts', difficulty: 'severe', targetGoal: 'pronunciation' },
  // Severe - Sentences
  { type: 'sentence_reading', title: 'Complex Sentence', instruction: 'Read this longer sentence clearly and naturally', content: 'The experienced teacher explained the complicated mathematical concept to her eager students', difficulty: 'severe', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Professional Speech', instruction: 'Speak clearly as if in a presentation', content: 'We are pleased to announce the successful completion of our quarterly objectives', difficulty: 'severe', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Narrative Sentence', instruction: 'Read with proper expression and pacing', content: 'After walking through the mysterious forest, they discovered an ancient hidden temple', difficulty: 'severe', targetGoal: 'pronunciation' },
];

const fluencyExercises: Omit<Exercise, 'id'>[] = [
  // Beginner
  { type: 'breathing', title: 'Deep Breathing', instruction: 'Inhale for 4 seconds, hold for 4, exhale for 4', content: '🌬️ Breathe in... hold... and release slowly. Repeat 5 times.', difficulty: 'beginner', targetGoal: 'fluency' },
  { type: 'word_repetition', title: 'Single Words', instruction: 'Say each word with a calm breath', content: 'One... Two... Three... Four... Five...', difficulty: 'beginner', targetGoal: 'fluency' },
  { type: 'breathing', title: 'Relaxation Exercise', instruction: 'Relax your jaw and shoulders while breathing', content: '😌 Release tension, breathe deeply, and feel calm before speaking.', difficulty: 'beginner', targetGoal: 'fluency' },
  // Moderate
  { type: 'sentence_reading', title: 'Paced Reading', instruction: 'Read at a slow, steady pace with pauses at commas', content: 'Today is a beautiful day, the sun is shining, and the birds are singing in the trees.', difficulty: 'moderate', targetGoal: 'fluency' },
  { type: 'breathing', title: 'Speech Breathing', instruction: 'Take a breath before each phrase', content: '🗣️ (breath) Hello there. (breath) How are you today? (breath) I am doing well.', difficulty: 'moderate', targetGoal: 'fluency' },
  // Severe
  { type: 'sentence_reading', title: 'Extended Phrases', instruction: 'Maintain steady rhythm through longer sentences', content: 'When I speak clearly and calmly, I feel confident and in control of my words and my message.', difficulty: 'severe', targetGoal: 'fluency' },
  { type: 'breathing', title: 'Diaphragmatic Control', instruction: 'Speak from your diaphragm with controlled airflow', content: '🎯 Practice: "Ahhhhh" for 10 seconds steadily, then "Mmmmmm" for 10 seconds.', difficulty: 'severe', targetGoal: 'fluency' },
];

const accentExercises: Omit<Exercise, 'id'>[] = [
  // Beginner
  { type: 'minimal_pairs', title: 'Minimal Pairs - Basic', instruction: 'Notice the difference between these similar sounds', content: 'Ship vs Sheep | Bat vs Bet | Cat vs Cut', difficulty: 'beginner', targetGoal: 'accent' },
  { type: 'intonation', title: 'Question Intonation', instruction: 'Raise your voice at the end for questions', content: 'Are you coming? ↗️ | Is it ready? ↗️ | Do you understand? ↗️', difficulty: 'beginner', targetGoal: 'accent' },
  // Moderate
  { type: 'minimal_pairs', title: 'Minimal Pairs - Advanced', instruction: 'Focus on subtle sound differences', content: 'Think vs Sink | Three vs Tree | Path vs Pass', difficulty: 'moderate', targetGoal: 'accent' },
  { type: 'intonation', title: 'Stress Patterns', instruction: 'Emphasize the capitalized syllable', content: 'reCORD (verb) vs REcord (noun) | proDUCE vs PROduce', difficulty: 'moderate', targetGoal: 'accent' },
  // Severe
  { type: 'sentence_reading', title: 'Connected Speech', instruction: 'Practice natural word linking', content: 'What do you want to do? → "Whadaya wanna do?" | Going to → "Gonna"', difficulty: 'severe', targetGoal: 'accent' },
  { type: 'intonation', title: 'Emotion & Intonation', instruction: 'Express different emotions with the same sentence', content: 'Say "Really?" as: Surprised 😲 | Skeptical 🤨 | Excited 🎉 | Bored 😑', difficulty: 'severe', targetGoal: 'accent' },
];

const childExercises: Omit<Exercise, 'id'>[] = [
  { type: 'pronunciation', title: 'Animal Sounds', instruction: 'Make these fun animal sounds!', content: '🐱 Meow! | 🐶 Woof! | 🐮 Moo! | 🐷 Oink! | 🐸 Ribbit!', difficulty: 'beginner', targetGoal: 'child_development', ageGroup: 'child' },
  { type: 'syllable_drill', title: 'Alphabet Fun', instruction: 'Say each letter with its sound', content: 'A for Apple 🍎 | B for Ball ⚽ | C for Cat 🐱 | D for Dog 🐕', difficulty: 'beginner', targetGoal: 'child_development', ageGroup: 'child' },
  { type: 'word_repetition', title: 'Colors & Numbers', instruction: 'Say each word three times', content: 'Red 🔴 | Blue 🔵 | One ☝️ | Two ✌️ | Three 🤟', difficulty: 'beginner', targetGoal: 'child_development', ageGroup: 'child' },
  { type: 'sentence_reading', title: 'Simple Sentences', instruction: 'Read along with the fun sentences', content: 'The cat sat on the mat. 🐱 | I like to play. 🎮 | The sun is bright. ☀️', difficulty: 'moderate', targetGoal: 'child_development', ageGroup: 'child' },
  { type: 'tongue_twister', title: 'Fun Tongue Twister', instruction: 'Try to say this quickly!', content: 'Red lorry, yellow lorry, red lorry, yellow lorry! 🚗', difficulty: 'moderate', targetGoal: 'child_development', ageGroup: 'child' },
];

const vocabularyExercises: Omit<Exercise, 'id'>[] = [
  { type: 'word_repetition', title: 'Daily Words', instruction: 'Learn and repeat these useful words', content: 'Appreciate, Beautiful, Comfortable, Delicious, Excellent', difficulty: 'beginner', targetGoal: 'vocabulary' },
  { type: 'sentence_reading', title: 'Word in Context', instruction: 'Read how these words are used', content: 'The weather is BEAUTIFUL today. This chair is very COMFORTABLE.', difficulty: 'moderate', targetGoal: 'vocabulary' },
  { type: 'word_repetition', title: 'Advanced Vocabulary', instruction: 'Practice these sophisticated words', content: 'Serendipity, Ephemeral, Eloquent, Resilient, Ambiguous', difficulty: 'severe', targetGoal: 'vocabulary' },
];

const confidenceExercises: Omit<Exercise, 'id'>[] = [
  { type: 'breathing', title: 'Confidence Breath', instruction: 'Stand tall and breathe with confidence', content: '💪 Power Pose: Stand straight, breathe deeply, feel strong!', difficulty: 'beginner', targetGoal: 'confidence' },
  { type: 'sentence_reading', title: 'Positive Affirmations', instruction: 'Say these with confidence and belief', content: 'I speak clearly. My voice matters. I express myself well. I am confident.', difficulty: 'beginner', targetGoal: 'confidence' },
  { type: 'sentence_reading', title: 'Introduction Practice', instruction: 'Practice introducing yourself confidently', content: 'Hello, my name is [Your Name]. I am pleased to meet you. How are you today?', difficulty: 'moderate', targetGoal: 'confidence' },
  { type: 'sentence_reading', title: 'Public Speaking', instruction: 'Practice speaking as if presenting to a group', content: 'Today I would like to share with you an important topic. Please allow me to explain my thoughts clearly.', difficulty: 'severe', targetGoal: 'confidence' },
];

// Get all exercises
const getAllExercises = (): Omit<Exercise, 'id'>[] => [
  ...pronunciationExercises,
  ...fluencyExercises,
  ...accentExercises,
  ...childExercises,
  ...vocabularyExercises,
  ...confidenceExercises,
];

// Profile interface for exercise generation
interface UserProfile {
  age_group: string | null;
  preferred_language: string | null;
  goals: string[] | null;
  difficulty: string | null;
  therapy_mode?: string | null;
}

// Adaptive data for exercise selection
export interface AdaptiveData {
  weakExercises: string[];
  masteredExercises: string[];
  weakPhonemes: string[];
  currentDifficulty: 'beginner' | 'moderate' | 'severe';
  weakSounds?: string[]; // Sounds that need extra practice (e.g., 'r', 'th', 'sh')
}

// Map goal values to target goals
const goalMapping: Record<string, string> = {
  pronunciation: 'pronunciation',
  fluency: 'fluency',
  vocabulary: 'vocabulary',
  accent: 'accent',
  confidence: 'confidence',
  child_development: 'child_development',
};

// Check if exercise matches weak phoneme patterns
const matchesWeakPhoneme = (content: string, weakPhonemes: string[]): boolean => {
  if (weakPhonemes.length === 0) return false;
  
  const lowerContent = content.toLowerCase();
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
  
  return weakPhonemes.some(phoneme => {
    const regex = phonemePatterns[phoneme];
    return regex ? regex.test(lowerContent) : false;
  });
};

// Check if exercise contains weak sounds (single letters/sounds)
const containsWeakSound = (content: string, weakSounds: string[]): boolean => {
  if (!weakSounds || weakSounds.length === 0) return false;
  
  const lowerContent = content.toLowerCase();
  
  return weakSounds.some(sound => {
    // Create appropriate regex for each sound type
    const soundPatterns: Record<string, RegExp> = {
      'r': /r/gi,
      'l': /l/gi,
      's': /s/gi,
      'th': /th/gi,
      'sh': /sh/gi,
      'ch': /ch|tch/gi,
      'k': /k|c(?![eiy])/gi,
      'g': /g(?![eiy])/gi,
      'f': /f|ph/gi,
      'v': /v/gi,
      'z': /z/gi,
      'j': /j|g[eiy]|dge/gi,
      'w': /w/gi,
      'y': /y/gi,
      'p': /p/gi,
      'b': /b/gi,
      't': /t(?!h)/gi,
      'd': /d/gi,
      'm': /m/gi,
      'n': /n(?!g)/gi,
      'ng': /ng/gi,
      'h': /h/gi,
    };
    
    const regex = soundPatterns[sound];
    return regex ? regex.test(lowerContent) : lowerContent.includes(sound);
  });
};

// Generate personalized exercises based on user profile and adaptive data
export const generateExercises = (
  profile: UserProfile,
  sessionDurationMinutes: number,
  adaptiveData?: AdaptiveData
): Exercise[] => {
  const exercises: Exercise[] = [];
  const allExercises = getAllExercises();
  
  // Use adaptive difficulty if available, otherwise use profile
  const effectiveDifficulty = adaptiveData?.currentDifficulty || profile.difficulty || 'beginner';
  
  const validDifficulties = effectiveDifficulty === 'severe' 
    ? ['beginner', 'moderate', 'severe']
    : effectiveDifficulty === 'moderate'
    ? ['beginner', 'moderate']
    : ['beginner'];

  // Determine target goals based on therapy mode
  const therapyMode = profile.therapy_mode || 'pronunciation';
  const modeGoalMapping: Record<string, string[]> = {
    pronunciation: ['pronunciation', 'vocabulary'],
    fluency: ['fluency', 'confidence'],
    child_development: ['child_development', 'pronunciation', 'vocabulary'],
    accent: ['accent', 'pronunciation', 'confidence'],
  };
  
  // Start with mode-specific goals
  let targetGoals = modeGoalMapping[therapyMode] || ['pronunciation'];
  
  // Also include user's selected goals for more variety
  const userGoals = profile.goals || [];
  userGoals.forEach(g => {
    const mapped = goalMapping[g] || g;
    if (!targetGoals.includes(mapped)) {
      targetGoals.push(mapped);
    }
  });

  // Add child exercises if age group is child or mode is child_development
  if (profile.age_group === 'child' || therapyMode === 'child_development') {
    if (!targetGoals.includes('child_development')) {
      targetGoals.push('child_development');
    }
  }

  // Filter exercises based on profile
  let filteredExercises = allExercises.filter(ex => {
    // Check difficulty
    if (!validDifficulties.includes(ex.difficulty)) return false;
    
    // Check if it matches any user goal
    if (!targetGoals.includes(ex.targetGoal)) return false;
    
    // Check age group for child-specific exercises
    if (ex.ageGroup === 'child' && profile.age_group !== 'child') return false;
    
    return true;
  });

  // If no matching exercises, fall back to all beginner pronunciation
  if (filteredExercises.length === 0) {
    filteredExercises = allExercises.filter(
      ex => ex.difficulty === 'beginner' && ex.targetGoal === 'pronunciation'
    );
  }

  // Calculate number of exercises based on duration (approximately 2 minutes per exercise)
  const exerciseCount = Math.max(3, Math.ceil(sessionDurationMinutes / 2));

  // Apply adaptive logic if data is available
  if (adaptiveData) {
    const { weakExercises, masteredExercises, weakPhonemes, weakSounds } = adaptiveData;
    
    // Prioritize: weak exercises > exercises with weak sounds > exercises with weak phonemes > new exercises > mastered (exclude)
    const highPriorityExercises: Omit<Exercise, 'id'>[] = [];
    const prioritizedExercises: Omit<Exercise, 'id'>[] = [];
    const normalExercises: Omit<Exercise, 'id'>[] = [];
    
    filteredExercises.forEach(ex => {
      // Skip mastered exercises (don't repeat too often)
      if (masteredExercises.includes(ex.content)) {
        // Include mastered only 20% of the time for variety
        if (Math.random() > 0.2) return;
      }
      
      // Highest priority: weak exercises from user history
      if (weakExercises.includes(ex.content)) {
        highPriorityExercises.push(ex);
        return;
      }
      
      // High priority: exercises containing weak sounds (from sound analysis)
      if (weakSounds && containsWeakSound(ex.content, weakSounds)) {
        prioritizedExercises.push(ex);
        return;
      }
      
      // Medium priority: exercises with weak phoneme patterns
      if (matchesWeakPhoneme(ex.content, weakPhonemes)) {
        prioritizedExercises.push(ex);
        return;
      }
      
      normalExercises.push(ex);
    });
    
    // Shuffle within categories
    const shuffledHighPriority = highPriorityExercises.sort(() => Math.random() - 0.5);
    const shuffledPriority = prioritizedExercises.sort(() => Math.random() - 0.5);
    const shuffledNormal = normalExercises.sort(() => Math.random() - 0.5);
    
    // Combine: highest priority first, then prioritized, then normal
    filteredExercises = [...shuffledHighPriority, ...shuffledPriority, ...shuffledNormal];
  } else {
    // No adaptive data, just shuffle
    filteredExercises = [...filteredExercises].sort(() => Math.random() - 0.5);
  }
  
  // If we need more exercises than available, repeat some
  while (filteredExercises.length < exerciseCount) {
    const originalFiltered = allExercises.filter(ex => 
      validDifficulties.includes(ex.difficulty) && targetGoals.includes(ex.targetGoal)
    );
    filteredExercises.push(...originalFiltered.sort(() => Math.random() - 0.5));
  }

  // Select the required number
  for (let i = 0; i < Math.min(exerciseCount, filteredExercises.length); i++) {
    exercises.push({
      ...filteredExercises[i],
      id: `exercise-${i}-${Date.now()}`,
    });
  }

  // Always start with a breathing exercise if fluency is a goal
  if (targetGoals.includes('fluency') && exercises.length > 0) {
    const breathingExercise = allExercises.find(
      ex => ex.type === 'breathing' && validDifficulties.includes(ex.difficulty)
    );
    if (breathingExercise && exercises[0].type !== 'breathing') {
      exercises.unshift({
        ...breathingExercise,
        id: `breathing-start-${Date.now()}`,
      });
    }
  }

  return exercises;
};

// Get exercise type display name
export const getExerciseTypeName = (type: Exercise['type']): string => {
  const names: Record<Exercise['type'], string> = {
    pronunciation: 'Pronunciation',
    breathing: 'Breathing Exercise',
    tongue_twister: 'Tongue Twister',
    word_repetition: 'Word Practice',
    sentence_reading: 'Reading Aloud',
    minimal_pairs: 'Minimal Pairs',
    syllable_drill: 'Syllable Drill',
    intonation: 'Intonation Practice',
  };
  return names[type] || type;
};

// Get exercise icon
export const getExerciseIcon = (type: Exercise['type']): string => {
  const icons: Record<Exercise['type'], string> = {
    pronunciation: '🗣️',
    breathing: '🌬️',
    tongue_twister: '👅',
    word_repetition: '🔄',
    sentence_reading: '📖',
    minimal_pairs: '👂',
    syllable_drill: '🎵',
    intonation: '🎭',
  };
  return icons[type] || '🎯';
};
