import { supabase } from '@/integrations/supabase/client';

// Sound/phoneme patterns and their example words
export interface SoundPattern {
  sound: string;
  displayName: string;
  examples: string[];
  practiceWords: string[];
  practiceSentences: string[];
}

// Comprehensive sound patterns for English
export const SOUND_PATTERNS: SoundPattern[] = [
  {
    sound: 'r',
    displayName: 'R',
    examples: ['r', 'rr', 'wr'],
    practiceWords: ['Run', 'Red', 'River', 'Right', 'Rain', 'Rock', 'Rose', 'Room'],
    practiceSentences: [
      'The red rabbit ran rapidly',
      'Rain rolls down the road',
      'Robert wrote a letter to Rachel',
    ],
  },
  {
    sound: 'l',
    displayName: 'L',
    examples: ['l', 'll'],
    practiceWords: ['Love', 'Light', 'Lemon', 'Leaf', 'Lion', 'Lamp', 'Lake', 'Lazy'],
    practiceSentences: [
      'Lucy loves lemon lollipops',
      'The little lamb leaped lazily',
      'Look at the lovely lake',
    ],
  },
  {
    sound: 's',
    displayName: 'S',
    examples: ['s', 'ss', 'c'],
    practiceWords: ['Sun', 'Sit', 'See', 'Sing', 'Soft', 'Star', 'Snake', 'Smile'],
    practiceSentences: [
      'Six slippery snails slid slowly',
      'Sam sees seven stars',
      'Sally sells seashells',
    ],
  },
  {
    sound: 'th',
    displayName: 'TH',
    examples: ['th'],
    practiceWords: ['The', 'This', 'That', 'Think', 'Thank', 'Three', 'Throw', 'Thumb'],
    practiceSentences: [
      'Think about three things',
      'This is their thumb',
      'The thick thief threw three thorns',
    ],
  },
  {
    sound: 'sh',
    displayName: 'SH',
    examples: ['sh'],
    practiceWords: ['She', 'Ship', 'Shop', 'Shoe', 'Shell', 'Shark', 'Shine', 'Shape'],
    practiceSentences: [
      'She sells seashells by the shore',
      'The shark swam by the ship',
      'Shannon showed her shiny shoes',
    ],
  },
  {
    sound: 'ch',
    displayName: 'CH',
    examples: ['ch', 'tch'],
    practiceWords: ['Chip', 'Chair', 'Cheese', 'Chicken', 'Church', 'Chase', 'Chocolate', 'Champion'],
    practiceSentences: [
      'Charlie chose chocolate chip cookies',
      'The chicken chased the child',
      'Check the chair in the church',
    ],
  },
  {
    sound: 'k',
    displayName: 'K/C',
    examples: ['k', 'c', 'ck'],
    practiceWords: ['Cat', 'Kite', 'King', 'Keep', 'Cake', 'Cook', 'Quick', 'Duck'],
    practiceSentences: [
      'The king kept a kite',
      'Kate cooked a cake for Kim',
      'The quick duck kicked a rock',
    ],
  },
  {
    sound: 'g',
    displayName: 'G',
    examples: ['g', 'gg'],
    practiceWords: ['Go', 'Good', 'Girl', 'Give', 'Green', 'Grape', 'Goat', 'Game'],
    practiceSentences: [
      'The good girl gave a gift',
      'Green grapes grow on the ground',
      'Gary played a great game',
    ],
  },
  {
    sound: 'f',
    displayName: 'F',
    examples: ['f', 'ff', 'ph'],
    practiceWords: ['Fun', 'Fish', 'Five', 'Food', 'Friend', 'Flower', 'Phone', 'Photo'],
    practiceSentences: [
      'Five funny fish swam fast',
      'Fred found a beautiful flower',
      'The phone fell on the floor',
    ],
  },
  {
    sound: 'v',
    displayName: 'V',
    examples: ['v'],
    practiceWords: ['Very', 'Voice', 'Visit', 'Van', 'Vine', 'Vest', 'Violin', 'Village'],
    practiceSentences: [
      'Vivian has a very nice voice',
      'The van visited the village',
      'Victor plays the violin very well',
    ],
  },
  {
    sound: 'z',
    displayName: 'Z',
    examples: ['z', 'zz', 's'],
    practiceWords: ['Zoo', 'Zero', 'Zebra', 'Zip', 'Zone', 'Zoom', 'Buzz', 'Fizz'],
    practiceSentences: [
      'Zara saw a zebra at the zoo',
      'The buzzing bee zoomed by',
      'Zero zebras zipped past',
    ],
  },
  {
    sound: 'j',
    displayName: 'J',
    examples: ['j', 'g', 'dge'],
    practiceWords: ['Jump', 'Juice', 'Jar', 'Jelly', 'Judge', 'Badge', 'Jungle', 'Joy'],
    practiceSentences: [
      'Jack jumped with joy',
      'The judge ate jelly from a jar',
      'Joyful Jane went to the jungle',
    ],
  },
  {
    sound: 'w',
    displayName: 'W',
    examples: ['w', 'wh'],
    practiceWords: ['Water', 'Wind', 'Walk', 'Window', 'Watch', 'Whale', 'White', 'Wonder'],
    practiceSentences: [
      'The wind blew the water',
      'Walter walked past the window',
      'The white whale was wonderful',
    ],
  },
  {
    sound: 'y',
    displayName: 'Y',
    examples: ['y'],
    practiceWords: ['Yes', 'Yellow', 'Year', 'Young', 'Yell', 'Yard', 'Yawn', 'Yo-yo'],
    practiceSentences: [
      'The young yak yawned in the yard',
      'Yesterday was a yellow day',
      'Yes, the yo-yo is yours',
    ],
  },
  {
    sound: 'p',
    displayName: 'P',
    examples: ['p', 'pp'],
    practiceWords: ['Pig', 'Pop', 'Paper', 'Pepper', 'Purple', 'Happy', 'Apple', 'Puppy'],
    practiceSentences: [
      'Peter picked a peck of peppers',
      'The happy puppy played in the park',
      'Put the purple paper on the pile',
    ],
  },
  {
    sound: 'b',
    displayName: 'B',
    examples: ['b', 'bb'],
    practiceWords: ['Ball', 'Big', 'Bird', 'Baby', 'Blue', 'Bubble', 'Rabbit', 'Ribbon'],
    practiceSentences: [
      'The big blue ball bounced',
      'Bobby blew beautiful bubbles',
      'The baby bird had bright feathers',
    ],
  },
  {
    sound: 't',
    displayName: 'T',
    examples: ['t', 'tt'],
    practiceWords: ['Top', 'Time', 'Table', 'Tiger', 'Butter', 'Letter', 'Kitten', 'Button'],
    practiceSentences: [
      'The tiger sat on top of the table',
      'Tom put butter on his toast',
      'The little kitten lost a button',
    ],
  },
  {
    sound: 'd',
    displayName: 'D',
    examples: ['d', 'dd'],
    practiceWords: ['Dog', 'Day', 'Door', 'Daddy', 'Ladder', 'Daddy', 'Puddle', 'Middle'],
    practiceSentences: [
      'The dog dug by the door',
      'Daddy walked in the middle of the day',
      'David dodged the deep puddle',
    ],
  },
  {
    sound: 'm',
    displayName: 'M',
    examples: ['m', 'mm'],
    practiceWords: ['Mom', 'Man', 'Moon', 'Mouse', 'Hammer', 'Summer', 'Mommy', 'Yummy'],
    practiceSentences: [
      'Mom made yummy muffins',
      'The mouse looked at the moon',
      'My mommy uses a hammer',
    ],
  },
  {
    sound: 'n',
    displayName: 'N',
    examples: ['n', 'nn', 'kn'],
    practiceWords: ['No', 'Net', 'Night', 'Nose', 'Sunny', 'Bunny', 'Dinner', 'Penny'],
    practiceSentences: [
      'Nana made dinner at night',
      'The sunny bunny needs a nap',
      'Nancy knew nine numbers',
    ],
  },
  {
    sound: 'ng',
    displayName: 'NG',
    examples: ['ng', 'n'],
    practiceWords: ['Ring', 'Sing', 'King', 'Swing', 'Thing', 'Strong', 'Hang', 'Bang'],
    practiceSentences: [
      'The king likes to sing songs',
      'Ring the strong bell',
      'Hang the thing on the swing',
    ],
  },
  {
    sound: 'h',
    displayName: 'H',
    examples: ['h'],
    practiceWords: ['Hat', 'Happy', 'Hello', 'House', 'Hand', 'Heart', 'Horse', 'Honey'],
    practiceSentences: [
      'Hello, happy horse',
      'Hank held a honey hat',
      'Her heart is in her house',
    ],
  },
];

// Interface for weak sound analysis result
export interface WeakSoundResult {
  sound: string;
  displayName: string;
  occurrences: number;
  averageScore: number;
  affectedWords: string[];
}

// Interface for today's focus
export interface TodaysFocus {
  primarySound: SoundPattern | null;
  secondarySounds: SoundPattern[];
  miniPracticeSet: {
    words: string[];
    sentences: string[];
  };
  totalWeakSounds: number;
}

// Detect which sounds are in a word
export const detectSoundsInWord = (word: string): string[] => {
  const lowerWord = word.toLowerCase();
  const detectedSounds: string[] = [];

  // Order matters - check longer patterns first
  const soundChecks: [string, RegExp][] = [
    ['th', /th/gi],
    ['sh', /sh/gi],
    ['ch', /ch|tch/gi],
    ['ng', /ng/gi],
    ['wh', /wh/gi],
    ['ph', /ph/gi],
    ['ck', /ck/gi],
    ['r', /r/gi],
    ['l', /l/gi],
    ['s', /s(?!h)/gi],
    ['k', /k|c(?![eiy])|q/gi],
    ['g', /g(?![eiy])/gi],
    ['f', /f/gi],
    ['v', /v/gi],
    ['z', /z/gi],
    ['j', /j|g[eiy]|dge/gi],
    ['w', /w(?!h)/gi],
    ['y', /^y|y(?=[aeiou])/gi],
    ['p', /p/gi],
    ['b', /b/gi],
    ['t', /t(?!h|ch)/gi],
    ['d', /d(?!ge)/gi],
    ['m', /m/gi],
    ['n', /n(?!g)/gi],
    ['h', /h(?![aeiou])|^h/gi],
  ];

  for (const [sound, regex] of soundChecks) {
    if (regex.test(lowerWord)) {
      if (!detectedSounds.includes(sound)) {
        detectedSounds.push(sound);
      }
    }
  }

  return detectedSounds;
};

// Analyze weak sounds across all user's exercise results
export const analyzeWeakSounds = async (userId: string): Promise<WeakSoundResult[]> => {
  // Get all low-scoring exercise results
  const { data, error } = await supabase
    .from('exercise_results')
    .select('exercise_text, score, recognized_text')
    .eq('user_id', userId)
    .lt('score', 75)
    .order('created_at', { ascending: false })
    .limit(200);

  if (error || !data) {
    console.error('Error fetching exercise results:', error);
    return [];
  }

  // Analyze sounds in low-scoring words
  const soundStats = new Map<string, { 
    totalScore: number; 
    count: number; 
    words: Set<string>;
  }>();

  data.forEach((result) => {
    // Extract individual words from exercise text
    const words = result.exercise_text.split(/[\s,.|!?]+/).filter(w => w.length > 0);
    
    words.forEach((word) => {
      const sounds = detectSoundsInWord(word);
      sounds.forEach((sound) => {
        const existing = soundStats.get(sound) || { totalScore: 0, count: 0, words: new Set() };
        existing.totalScore += result.score || 0;
        existing.count += 1;
        existing.words.add(word.toLowerCase());
        soundStats.set(sound, existing);
      });
    });
  });

  // Convert to array and sort by occurrence
  const weakSounds: WeakSoundResult[] = [];
  soundStats.forEach((stats, sound) => {
    // Only include sounds that appear multiple times
    if (stats.count >= 2) {
      const pattern = SOUND_PATTERNS.find(p => p.sound === sound);
      weakSounds.push({
        sound,
        displayName: pattern?.displayName || sound.toUpperCase(),
        occurrences: stats.count,
        averageScore: Math.round(stats.totalScore / stats.count),
        affectedWords: Array.from(stats.words).slice(0, 10),
      });
    }
  });

  // Sort by occurrences (most frequent issues first)
  weakSounds.sort((a, b) => b.occurrences - a.occurrences);

  return weakSounds.slice(0, 10);
};

// Get today's focus sound with mini practice set
export const getTodaysFocus = async (userId: string): Promise<TodaysFocus> => {
  const weakSounds = await analyzeWeakSounds(userId);

  if (weakSounds.length === 0) {
    return {
      primarySound: null,
      secondarySounds: [],
      miniPracticeSet: { words: [], sentences: [] },
      totalWeakSounds: 0,
    };
  }

  // Primary focus is the most problematic sound
  const primarySoundData = weakSounds[0];
  const primarySound = SOUND_PATTERNS.find(p => p.sound === primarySoundData.sound) || null;

  // Secondary sounds (2nd and 3rd most problematic)
  const secondarySounds: SoundPattern[] = [];
  for (let i = 1; i < Math.min(3, weakSounds.length); i++) {
    const pattern = SOUND_PATTERNS.find(p => p.sound === weakSounds[i].sound);
    if (pattern) {
      secondarySounds.push(pattern);
    }
  }

  // Generate mini practice set
  const miniPracticeSet = {
    words: primarySound?.practiceWords.slice(0, 6) || [],
    sentences: primarySound?.practiceSentences.slice(0, 2) || [],
  };

  // Add some words from the user's actual weak words
  const userWeakWords = primarySoundData.affectedWords.slice(0, 3);
  miniPracticeSet.words = [...new Set([...userWeakWords, ...miniPracticeSet.words])].slice(0, 8);

  return {
    primarySound,
    secondarySounds,
    miniPracticeSet,
    totalWeakSounds: weakSounds.length,
  };
};

// Generate focused exercise set for a specific sound
export const generateSoundFocusedExercises = (
  sound: SoundPattern,
  count: number = 5
): { words: string[]; sentences: string[] } => {
  const shuffledWords = [...sound.practiceWords].sort(() => Math.random() - 0.5);
  const shuffledSentences = [...sound.practiceSentences].sort(() => Math.random() - 0.5);

  return {
    words: shuffledWords.slice(0, count),
    sentences: shuffledSentences.slice(0, Math.min(2, shuffledSentences.length)),
  };
};

// Get sounds that should be prioritized in exercise generation
export const getWeakSoundsForExercises = async (userId: string): Promise<string[]> => {
  const weakSounds = await analyzeWeakSounds(userId);
  // Return top 3 weak sounds for prioritization
  return weakSounds.slice(0, 3).map(s => s.sound);
};
