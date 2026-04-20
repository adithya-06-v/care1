import { useState } from 'react';

export interface WordAnalysis {
  word: string;
  status: 'correct' | 'incorrect' | 'skipped';
  score?: number;
}

export interface SpeechAnalysisResult {
  recognizedText: string;
  pronunciationScore: number;
  charAccuracy: number;
  feedbackMessage: string;
  improvementTip: string;
  mispronounced: string[];
  mismatchHint: string;
  isSentence: boolean;
  wordAnalysis: WordAnalysis[];
  skippedWords: string[];
  incorrectWords: string[];
  needsWordDrill: boolean;
}

interface UseSpeechAnalysisReturn {
  isAnalyzing: boolean;
  analyzeResult: SpeechAnalysisResult | null;
  error: string | null;
  analyzeSpeech: (recognizedText: string, expectedText: string) => Promise<SpeechAnalysisResult | null>;
  resetAnalysis: () => void;
}

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function calculateAccuracy(expected: string, spoken: string): number {
  const normExpected = normalizeText(expected);
  const normSpoken = normalizeText(spoken);

  if (normExpected.length === 0) return normSpoken.length === 0 ? 100 : 0;

  const maxLen = Math.max(normExpected.length, normSpoken.length);
  let matched = 0;

  for (let i = 0; i < Math.min(normExpected.length, normSpoken.length); i++) {
    if (normExpected[i] === normSpoken[i]) {
      matched++;
    }
  }

  return Math.round((matched / maxLen) * 100);
}

function findMismatchHint(expected: string, spoken: string): string {
  const normExp = normalizeText(expected);
  const normSpk = normalizeText(spoken);
  const minLen = Math.min(normExp.length, normSpk.length);

  for (let i = 0; i < minLen; i++) {
    if (normExp[i] !== normSpk[i]) {
      const start = Math.max(0, i - 2);
      const snippet = normExp.substring(start, i + 3);
      return `Check pronunciation near "${snippet}"`;
    }
  }

  if (normExp.length !== normSpk.length) {
    return normSpk.length < normExp.length
      ? 'Some sounds at the end were missed'
      : 'Extra sounds were detected at the end';
  }

  return '';
}

const levenshtein = (a: string, b: string): number => {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

const isSimilar = (expected: string, recognized: string): boolean => {
  if (expected === recognized) return true;
  const maxLen = Math.max(expected.length, recognized.length);
  if (maxLen === 0) return true;
  return (1 - levenshtein(expected, recognized) / maxLen) >= 0.8;
};

const analyzeWords = (expectedText: string, recognizedText: string): {
  wordAnalysis: WordAnalysis[];
  skippedWords: string[];
  incorrectWords: string[];
  correctCount: number;
} => {
  const expectedWords = normalizeText(expectedText).split(/\s+/).filter(Boolean);
  const recognizedWords = normalizeText(recognizedText).split(/\s+/).filter(Boolean);

  const wordAnalysis: WordAnalysis[] = [];
  const skippedWords: string[] = [];
  const incorrectWords: string[] = [];
  let correctCount = 0;

  expectedWords.forEach((expectedWord, idx) => {
    const searchRange = recognizedWords.slice(Math.max(0, idx - 2), idx + 3);
    const matchFound = searchRange.some(rw => isSimilar(expectedWord, rw));

    if (matchFound) {
      wordAnalysis.push({ word: expectedWord, status: 'correct' });
      correctCount++;
    } else {
      const partialMatch = searchRange.some(rw =>
        rw.includes(expectedWord.slice(0, 3)) || expectedWord.includes(rw.slice(0, 3))
      );

      if (partialMatch) {
        wordAnalysis.push({ word: expectedWord, status: 'incorrect' });
        incorrectWords.push(expectedWord);
      } else {
        wordAnalysis.push({ word: expectedWord, status: 'skipped' });
        skippedWords.push(expectedWord);
      }
    }
  });

  return { wordAnalysis, skippedWords, incorrectWords, correctCount };
};

export const useSpeechAnalysis = (): UseSpeechAnalysisReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<SpeechAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeSpeech = async (recognizedText: string, expectedText: string): Promise<SpeechAnalysisResult | null> => {
    setIsAnalyzing(true);
    setError(null);
    setAnalyzeResult(null);

    try {
      const wordCount = expectedText.split(/\s+/).filter(Boolean).length;
      const isSentence = wordCount > 2;

      const charAccuracy = calculateAccuracy(expectedText, recognizedText);
      const analysis = analyzeWords(expectedText, recognizedText);
      const wordAccuracy = wordCount > 0
        ? Math.round((analysis.correctCount / wordCount) * 100)
        : 0;

      // Blend: 40% character accuracy + 60% word accuracy for a more forgiving but meaningful score
      const pronunciationScore = Math.round(charAccuracy * 0.4 + wordAccuracy * 0.6);

      const mispronounced = [...analysis.incorrectWords, ...analysis.skippedWords];
      const mismatchHint = findMismatchHint(expectedText, recognizedText);

      let feedbackMessage: string;
      let improvementTip: string;

      if (pronunciationScore >= 90) {
        feedbackMessage = 'Excellent! Your pronunciation is very clear.';
        improvementTip = 'Keep up the great work! Try increasing your speed gradually.';
      } else if (pronunciationScore >= 80) {
        feedbackMessage = 'Great job! Almost perfect.';
        improvementTip = mispronounced.length > 0
          ? `Small refinement needed on: ${mispronounced.join(', ')}`
          : 'Just a tiny bit more clarity and you\'re there!';
      } else if (pronunciationScore >= 60) {
        feedbackMessage = 'Good effort! A few words need practice.';
        improvementTip = mispronounced.length > 0
          ? `Focus on: ${mispronounced.join(', ')}`
          : 'Try speaking a bit more slowly and clearly.';
      } else if (pronunciationScore >= 40) {
        feedbackMessage = 'Keep practicing! Some words were unclear.';
        improvementTip = mispronounced.length > 0
          ? `Practice these words individually: ${mispronounced.join(', ')}`
          : 'Slow down and enunciate each syllable.';
      } else {
        feedbackMessage = 'Let\'s try again. Speak slowly and clearly.';
        improvementTip = 'Break the text into smaller parts and practice each one.';
      }

      if (mismatchHint && pronunciationScore < 90) {
        improvementTip += `. ${mismatchHint}`;
      }

      const needsWordDrill = isSentence &&
        (pronunciationScore < 60 || (analysis.skippedWords.length + analysis.incorrectWords.length) >= 2);

      const result: SpeechAnalysisResult = {
        recognizedText,
        pronunciationScore,
        charAccuracy,
        feedbackMessage,
        improvementTip,
        mispronounced,
        mismatchHint,
        isSentence,
        wordAnalysis: analysis.wordAnalysis,
        skippedWords: analysis.skippedWords,
        incorrectWords: analysis.incorrectWords,
        needsWordDrill,
      };

      setAnalyzeResult(result);
      console.log('Analysis complete:', result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze speech';
      console.error('Speech analysis error:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setAnalyzeResult(null);
    setError(null);
    setIsAnalyzing(false);
  };

  return {
    isAnalyzing,
    analyzeResult,
    error,
    analyzeSpeech,
    resetAnalysis,
  };
};
