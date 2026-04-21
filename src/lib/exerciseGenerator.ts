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

// 50 Medium to Easy Words
const wordBank: Omit<Exercise, 'id'>[] = [
  { type: 'word_repetition', title: 'Basic Word', instruction: 'Speak clearly', content: 'Cat', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Basic Word', instruction: 'Speak clearly', content: 'Dog', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Basic Word', instruction: 'Speak clearly', content: 'Sun', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Basic Word', instruction: 'Speak clearly', content: 'Moon', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Basic Word', instruction: 'Speak clearly', content: 'Ball', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Basic Word', instruction: 'Speak clearly', content: 'Book', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Basic Word', instruction: 'Speak clearly', content: 'Tree', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Basic Word', instruction: 'Speak clearly', content: 'Fish', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Basic Word', instruction: 'Speak clearly', content: 'Bird', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Basic Word', instruction: 'Speak clearly', content: 'Home', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Color Name', instruction: 'Speak clearly', content: 'Blue', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Color Name', instruction: 'Speak clearly', content: 'Green', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Color Name', instruction: 'Speak clearly', content: 'Red', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Color Name', instruction: 'Speak clearly', content: 'Yellow', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Fruit Name', instruction: 'Speak clearly', content: 'Apple', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Basic Need', instruction: 'Speak clearly', content: 'Water', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Basic Food', instruction: 'Speak clearly', content: 'Bread', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Basic Drink', instruction: 'Speak clearly', content: 'Milk', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Emotion', instruction: 'Speak clearly', content: 'Happy', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Action', instruction: 'Speak clearly', content: 'Smile', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Relationship', instruction: 'Speak clearly', content: 'Friend', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Place', instruction: 'Speak clearly', content: 'School', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Object', instruction: 'Speak clearly', content: 'Paper', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Furniture', instruction: 'Speak clearly', content: 'Chair', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Furniture', instruction: 'Speak clearly', content: 'Table', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Structure', instruction: 'Speak clearly', content: 'Window', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Structure', instruction: 'Speak clearly', content: 'Door', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Technology', instruction: 'Speak clearly', content: 'Phone', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Environment', instruction: 'Speak clearly', content: 'Light', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Time', instruction: 'Speak clearly', content: 'Night', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Time', instruction: 'Speak clearly', content: 'Morning', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Season', instruction: 'Speak clearly', content: 'Summer', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Season', instruction: 'Speak clearly', content: 'Winter', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Nature', instruction: 'Speak clearly', content: 'Flower', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Environment', instruction: 'Speak clearly', content: 'Garden', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Hobby', instruction: 'Speak clearly', content: 'Music', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Entertainment', instruction: 'Speak clearly', content: 'Movie', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Food', instruction: 'Speak clearly', content: 'Pizza', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Action', instruction: 'Speak clearly', content: 'Travel', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Adjective', instruction: 'Speak clearly', content: 'Simple', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Adjective', instruction: 'Speak clearly', content: 'Better', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Action', instruction: 'Speak clearly', content: 'Listen', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Action', instruction: 'Speak clearly', content: 'Repeat', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Action', instruction: 'Speak clearly', content: 'Practice', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Noun', instruction: 'Speak clearly', content: 'Success', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Adjective', instruction: 'Speak clearly', content: 'Healthy', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Relationship', instruction: 'Speak clearly', content: 'Family', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Group', instruction: 'Speak clearly', content: 'People', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Nature', instruction: 'Speak clearly', content: 'Animal', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'word_repetition', title: 'Nature', instruction: 'Speak clearly', content: 'Nature', difficulty: 'moderate', targetGoal: 'pronunciation' },
];

// 50 Medium to Easy Sentences
const sentenceBank: Omit<Exercise, 'id'>[] = [
  { type: 'sentence_reading', title: 'Daily Life', instruction: 'Read naturally', content: 'I like to eat apples', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Observation', instruction: 'Read naturally', content: 'The sun is very bright', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Relationship', instruction: 'Read naturally', content: 'My friend is very kind', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Home', instruction: 'Read naturally', content: 'I live in a house', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Feeling', instruction: 'Read naturally', content: 'The water is so cold', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Activity', instruction: 'Read naturally', content: 'We go to the park', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Observation', instruction: 'Read naturally', content: 'The cat is on the mat', difficulty: 'beginner', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Hobby', instruction: 'Read naturally', content: 'I love reading new books', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Observation', instruction: 'Read naturally', content: 'It is a beautiful day', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Goal', instruction: 'Read naturally', content: 'I want to learn more', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Nature', instruction: 'Read naturally', content: 'The flowers grow in spring', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Transport', instruction: 'Read naturally', content: 'He drives a fast car', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Music', instruction: 'Read naturally', content: 'She plays the piano well', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Travel', instruction: 'Read naturally', content: 'My family loves to travel', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Routine', instruction: 'Read naturally', content: 'I drink milk every morning', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Animal', instruction: 'Read naturally', content: 'The dog is barking loudly', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Activity', instruction: 'Read naturally', content: 'We are going to the mall', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Nature', instruction: 'Read naturally', content: 'The birds sing in trees', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Emotion', instruction: 'Read naturally', content: 'I am feeling very happy', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Action', instruction: 'Read naturally', content: 'Please close the front door', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Nature', instruction: 'Read naturally', content: 'The moon shines at night', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Preference', instruction: 'Read naturally', content: 'I like the color blue', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Request', instruction: 'Read naturally', content: 'Can you help me please', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Home', instruction: 'Read naturally', content: 'I have a small garden', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Object', instruction: 'Read naturally', content: 'The table is made of wood', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Hobby', instruction: 'Read naturally', content: 'Music makes me feel good', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Social', instruction: 'Read naturally', content: 'Lets go out for dinner', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Nature', instruction: 'Read naturally', content: 'I need some fresh air', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Family', instruction: 'Read naturally', content: 'The children are playing', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Social', instruction: 'Read naturally', content: 'I will see you tomorrow', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Health', instruction: 'Read naturally', content: 'Exercise is good for you', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Hobby', instruction: 'Read naturally', content: 'I like to watch movies', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Office', instruction: 'Read naturally', content: 'The paper is on the desk', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Tech', instruction: 'Read naturally', content: 'My phone is on the table', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Clothes', instruction: 'Read naturally', content: 'I wear a warm coat', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Weather', instruction: 'Read naturally', content: 'The rain fell all night', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Learning', instruction: 'Read naturally', content: 'I am learning to speak', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Task', instruction: 'Read naturally', content: 'This is a very easy task', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Nature', instruction: 'Read naturally', content: 'I enjoy walking in nature', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Season', instruction: 'Read naturally', content: 'Summer is my favorite time', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Food', instruction: 'Read naturally', content: 'I like to eat fresh fruit', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Night', instruction: 'Read naturally', content: 'The sky is full of stars', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Social', instruction: 'Read naturally', content: 'I will call you later', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Identity', instruction: 'Read naturally', content: 'My name is very special', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Request', instruction: 'Read naturally', content: 'I want a cup of tea', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Education', instruction: 'Read naturally', content: 'The school is very big', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Media', instruction: 'Read naturally', content: 'I read the news today', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Idiom', instruction: 'Read naturally', content: 'Time flies when you are having fun', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Wisdom', instruction: 'Read naturally', content: 'Practice makes us perfect', difficulty: 'moderate', targetGoal: 'pronunciation' },
  { type: 'sentence_reading', title: 'Affirmation', instruction: 'Read naturally', content: 'I am doing a great job', difficulty: 'moderate', targetGoal: 'pronunciation' },
];

export const getExerciseVarietyBucket = (
  exercise: Omit<Exercise, 'id'>
): 'word' | 'sentence' | 'long_phrase' => {
  if (
    exercise.type === 'word_repetition' ||
    exercise.type === 'pronunciation' ||
    exercise.type === 'minimal_pairs' ||
    exercise.type === 'syllable_drill'
  ) {
    return 'word';
  }

  const cleanedContent = exercise.content
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (cleanedContent.length >= 10) {
    return 'long_phrase';
  }

  return 'sentence';
};

// Generate personalized exercises based on user profile and preference
export const generateExercises = (
  profile: any, // Simplified for bank replacement
  sessionDurationMinutes: number,
  adaptiveData?: any,
  datasetExercises?: Omit<Exercise, 'id'>[],
  practicePreference?: 'word' | 'sentence',
): Exercise[] => {
  const exercises: Exercise[] = [];
  
  // Choose the relevant bank based on preference
  let primaryBank: Omit<Exercise, 'id'>[] = [];
  
  if (practicePreference === 'word') {
    primaryBank = [...wordBank];
  } else if (practicePreference === 'sentence') {
    primaryBank = [...sentenceBank];
  } else {
    primaryBank = [...wordBank, ...sentenceBank];
  }

  // Shuffle the bank
  const shuffledBank = [...primaryBank].sort(() => Math.random() - 0.5);

  // Calculate number of exercises based on duration (approximately 1 per minute for words, 2 per minute for sentences)
  // Let's aim for a good variety.
  const exerciseCount = Math.max(5, Math.ceil(sessionDurationMinutes * 1.5));

  // Take the required amount
  const selected = shuffledBank.slice(0, exerciseCount);

  selected.forEach((ex, i) => {
    exercises.push({
      ...ex,
      id: `exercise-${i}-${Date.now()}`,
    });
  });

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
