// Simulated AI feedback generator for speech therapy exercises
// In a production app, this would connect to actual speech recognition APIs

export interface FeedbackResult {
  score: number;
  mispronounced: string[];
  suggestion: string;
}

// Common pronunciation challenges by sound
const commonChallenges: Record<string, string[]> = {
  'r': ['r', 'rr', 'rl'],
  's': ['s', 'sh', 'ch', 'z'],
  'th': ['th', 'ð', 'θ'],
  'l': ['l', 'll', 'rl'],
  'v': ['v', 'w', 'f'],
  'w': ['w', 'wh', 'oo'],
};

// Suggestions based on difficulty areas
const suggestions: Record<string, string[]> = {
  pronunciation: [
    'Try slowing down and focusing on individual sounds.',
    'Practice in front of a mirror to watch your mouth movements.',
    'Break the word into syllables and practice each separately.',
    'Record yourself and compare with native speakers.',
    'Focus on tongue placement for difficult consonants.',
  ],
  fluency: [
    'Take a deep breath before speaking each phrase.',
    'Practice pacing by pausing at natural breaks.',
    'Use a metronome to maintain steady rhythm.',
    'Try the "easy onset" technique for starting words.',
    'Visualize the words before speaking them aloud.',
  ],
  accent: [
    'Listen to native speakers and mimic their intonation.',
    'Focus on the stressed syllables in each word.',
    'Practice minimal pairs to distinguish similar sounds.',
    'Pay attention to word linking in connected speech.',
    'Record and compare your speech patterns regularly.',
  ],
  confidence: [
    'Start with phrases you feel comfortable with.',
    'Practice positive affirmations daily.',
    'Celebrate small improvements consistently.',
    'Speak to yourself in the mirror regularly.',
    'Remember: clarity matters more than perfection.',
  ],
};

// Extract words from exercise content
const extractWords = (content: string): string[] => {
  return content
    .split(/[\s,|→↗️]+/)
    .map(word => word.replace(/[^a-zA-Z]/g, '').toLowerCase())
    .filter(word => word.length > 2);
};

// Generate simulated AI feedback
export const generateAIFeedback = (
  exerciseContent: string,
  exerciseType: string,
  difficulty: string,
  userGoals: string[]
): FeedbackResult => {
  // Base score varies by difficulty
  const baseScore = difficulty === 'beginner' ? 75 : difficulty === 'moderate' ? 65 : 55;
  
  // Random variation (+/- 20 points)
  const variation = Math.random() * 40 - 15;
  const score = Math.min(100, Math.max(40, Math.round(baseScore + variation)));

  // Determine mispronounced sounds based on score
  const mispronounced: string[] = [];
  if (score < 85) {
    const words = extractWords(exerciseContent);
    const challengingWords = words.slice(0, Math.ceil((100 - score) / 20));
    
    // Pick some sounds that might be challenging
    const possibleSounds = Object.keys(commonChallenges);
    const numSounds = Math.ceil((100 - score) / 25);
    
    for (let i = 0; i < numSounds && i < possibleSounds.length; i++) {
      const randomIndex = Math.floor(Math.random() * possibleSounds.length);
      const sound = possibleSounds[randomIndex];
      if (!mispronounced.includes(sound)) {
        mispronounced.push(`"${sound}" sound`);
      }
    }
  }

  // Get appropriate suggestion based on goals and type
  let suggestionCategory = 'pronunciation';
  if (exerciseType === 'breathing' || userGoals.includes('fluency')) {
    suggestionCategory = 'fluency';
  } else if (exerciseType === 'intonation' || exerciseType === 'minimal_pairs' || userGoals.includes('accent')) {
    suggestionCategory = 'accent';
  } else if (userGoals.includes('confidence')) {
    suggestionCategory = 'confidence';
  }

  const categorySuggestions = suggestions[suggestionCategory];
  const suggestion = categorySuggestions[Math.floor(Math.random() * categorySuggestions.length)];

  return {
    score,
    mispronounced,
    suggestion,
  };
};

// Generate improvement tips based on session performance
export const generateImprovementTips = (
  averageAccuracy: number,
  exerciseTypes: string[],
  userGoals: string[]
): string[] => {
  const tips: string[] = [];

  // Accuracy-based tips
  if (averageAccuracy < 60) {
    tips.push('Focus on simpler exercises first to build confidence.');
    tips.push('Consider reducing session duration for better focus.');
  } else if (averageAccuracy < 80) {
    tips.push('Great progress! Try challenging yourself with slightly harder exercises.');
    tips.push('Practice the sounds you struggled with separately.');
  } else {
    tips.push('Excellent work! You\'re ready to try more advanced exercises.');
    tips.push('Try increasing your speaking speed while maintaining accuracy.');
  }

  // Goal-based tips
  if (userGoals.includes('fluency')) {
    tips.push('Practice breathing exercises daily for 5 minutes.');
  }
  if (userGoals.includes('pronunciation')) {
    tips.push('Use tongue twisters to improve articulation.');
  }
  if (userGoals.includes('confidence')) {
    tips.push('Practice speaking in front of a mirror to build confidence.');
  }

  // General tips
  tips.push('Consistent daily practice yields the best results.');

  return tips.slice(0, 4);
};

// Generate words practiced from exercises
export const extractWordsPracticed = (exercises: Array<{ content: string }>): string[] => {
  const allWords: string[] = [];
  
  exercises.forEach(exercise => {
    const words = extractWords(exercise.content);
    allWords.push(...words);
  });

  // Return unique words
  return [...new Set(allWords)].slice(0, 20);
};
