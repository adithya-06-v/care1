// Simulated Emotion Detection from Speech Patterns

export type EmotionTag = 'confident' | 'hesitant' | 'nervous' | 'neutral';

export interface EmotionAnalysis {
  tag: EmotionTag;
  confidence: number; // 0-100
  indicators: string[];
  feedbackMessage: string;
  encouragement: string;
}

export interface RecordingMetrics {
  totalDuration: number; // in seconds
  pauseCount: number; // number of significant pauses detected
  longestPause: number; // longest pause in seconds
  retryCount: number; // how many times user re-recorded
  startDelay: number; // delay before speaking started (seconds)
  averagePauseDuration: number; // average pause duration
}

// Thresholds for emotion detection
const THRESHOLDS = {
  hesitation: {
    longPause: 2, // seconds - pause considered "long"
    multipleShortPauses: 3, // number of pauses indicating hesitation
    startDelay: 1.5, // seconds delay before starting to speak
  },
  nervous: {
    veryLongPause: 4, // seconds
    manyPauses: 5, // high number of pauses
    highRetryCount: 2, // multiple retries
    shortDuration: 0.5, // very short, rushed recording (ratio to expected)
  },
  confident: {
    minDuration: 1, // minimum recording duration for confidence
    maxPauses: 1, // few to no pauses
    maxStartDelay: 0.8, // quick start
    noRetries: 0, // no need to retry
  },
};

// Emotion feedback messages
const EMOTION_FEEDBACK: Record<EmotionTag, { message: string; encouragement: string }[]> = {
  confident: [
    {
      message: "Great confidence! Your speech was clear and steady.",
      encouragement: "Keep up the excellent work! Your confidence is shining through.",
    },
    {
      message: "Wonderful! You spoke with conviction and clarity.",
      encouragement: "Your confident delivery makes a real difference!",
    },
  ],
  hesitant: [
    {
      message: "You sounded slightly hesitant. Try speaking slower and more deliberately.",
      encouragement: "It's okay to take your time. Slow, steady practice builds confidence.",
    },
    {
      message: "We noticed some pauses. Take a deep breath and speak at your own pace.",
      encouragement: "Every attempt makes you stronger. You're making progress!",
    },
  ],
  nervous: [
    {
      message: "You seem a bit nervous. Remember to breathe and relax your shoulders.",
      encouragement: "Nervousness is natural. With practice, you'll feel more at ease.",
    },
    {
      message: "Take a moment to relax. Try speaking more slowly and confidently.",
      encouragement: "You're doing great by practicing! Each session helps build confidence.",
    },
  ],
  neutral: [
    {
      message: "Good attempt! Keep practicing for more natural delivery.",
      encouragement: "Consistent practice leads to improvement. Keep going!",
    },
  ],
};

/**
 * Analyze recording metrics to detect emotional state
 */
export const detectEmotion = (
  metrics: RecordingMetrics,
  pronunciationScore: number
): EmotionAnalysis => {
  const indicators: string[] = [];
  let emotionScores = {
    confident: 0,
    hesitant: 0,
    nervous: 0,
    neutral: 50, // baseline
  };

  // Analyze start delay
  if (metrics.startDelay > THRESHOLDS.nervous.veryLongPause) {
    emotionScores.nervous += 30;
    indicators.push('Long delay before speaking');
  } else if (metrics.startDelay > THRESHOLDS.hesitation.startDelay) {
    emotionScores.hesitant += 20;
    indicators.push('Hesitant start');
  } else if (metrics.startDelay <= THRESHOLDS.confident.maxStartDelay) {
    emotionScores.confident += 15;
    indicators.push('Quick, confident start');
  }

  // Analyze pauses
  if (metrics.pauseCount >= THRESHOLDS.nervous.manyPauses) {
    emotionScores.nervous += 25;
    indicators.push('Multiple pauses detected');
  } else if (metrics.pauseCount >= THRESHOLDS.hesitation.multipleShortPauses) {
    emotionScores.hesitant += 20;
    indicators.push('Several hesitation pauses');
  } else if (metrics.pauseCount <= THRESHOLDS.confident.maxPauses) {
    emotionScores.confident += 15;
    indicators.push('Smooth, uninterrupted speech');
  }

  // Analyze longest pause
  if (metrics.longestPause >= THRESHOLDS.nervous.veryLongPause) {
    emotionScores.nervous += 20;
    indicators.push('Very long pause during speech');
  } else if (metrics.longestPause >= THRESHOLDS.hesitation.longPause) {
    emotionScores.hesitant += 15;
    indicators.push('Long pause detected');
  }

  // Analyze retry count
  if (metrics.retryCount >= THRESHOLDS.nervous.highRetryCount) {
    emotionScores.nervous += 25;
    emotionScores.hesitant += 10;
    indicators.push('Multiple recording attempts');
  } else if (metrics.retryCount === THRESHOLDS.confident.noRetries) {
    emotionScores.confident += 20;
    indicators.push('First-attempt success');
  } else if (metrics.retryCount === 1) {
    emotionScores.hesitant += 10;
    indicators.push('One retry needed');
  }

  // Factor in pronunciation score
  if (pronunciationScore >= 85) {
    emotionScores.confident += 20;
    indicators.push('High pronunciation accuracy');
  } else if (pronunciationScore >= 70) {
    emotionScores.confident += 10;
  } else if (pronunciationScore < 50) {
    emotionScores.nervous += 10;
    emotionScores.hesitant += 10;
  }

  // Recording duration analysis (rushed = nervous, steady = confident)
  if (metrics.totalDuration < 1 && metrics.totalDuration > 0) {
    emotionScores.nervous += 15;
    indicators.push('Rushed delivery');
  }

  // Determine the dominant emotion
  const maxScore = Math.max(
    emotionScores.confident,
    emotionScores.hesitant,
    emotionScores.nervous,
    emotionScores.neutral
  );

  let tag: EmotionTag = 'neutral';
  if (emotionScores.confident === maxScore && emotionScores.confident > 50) {
    tag = 'confident';
  } else if (emotionScores.nervous === maxScore && emotionScores.nervous > 40) {
    tag = 'nervous';
  } else if (emotionScores.hesitant === maxScore && emotionScores.hesitant > 35) {
    tag = 'hesitant';
  }

  // Get random feedback for variety
  const feedbackOptions = EMOTION_FEEDBACK[tag];
  const selectedFeedback = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];

  return {
    tag,
    confidence: Math.min(maxScore, 100),
    indicators,
    feedbackMessage: selectedFeedback.message,
    encouragement: selectedFeedback.encouragement,
  };
};

/**
 * Get emotion badge color based on tag
 */
export const getEmotionColor = (tag: EmotionTag): string => {
  switch (tag) {
    case 'confident':
      return 'bg-green-500/10 text-green-600 border-green-500/20';
    case 'hesitant':
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    case 'nervous':
      return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

/**
 * Get emotion icon name for display
 */
export const getEmotionIcon = (tag: EmotionTag): string => {
  switch (tag) {
    case 'confident':
      return 'smile';
    case 'hesitant':
      return 'meh';
    case 'nervous':
      return 'frown';
    default:
      return 'circle';
  }
};
