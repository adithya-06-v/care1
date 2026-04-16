import { useState } from 'react';

export interface WordAnalysis {
  word: string;
  status: 'correct' | 'incorrect' | 'skipped';
  score?: number;
}

export interface SpeechAnalysisResult {
  recognizedText: string;
  pronunciationScore: number;
  feedbackMessage: string;
  improvementTip: string;
  mispronounced: string[];
  // Sentence-specific fields
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

// Analyze sentence by comparing expected vs recognized words
const analyzeWords = (expectedText: string, recognizedText: string): {
  wordAnalysis: WordAnalysis[];
  skippedWords: string[];
  incorrectWords: string[];
  correctCount: number;
} => {
  const expectedWords = expectedText.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
  const recognizedWords = recognizedText.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
  
  const wordAnalysis: WordAnalysis[] = [];
  const skippedWords: string[] = [];
  const incorrectWords: string[] = [];
  let correctCount = 0;
  
  // Use Levenshtein distance for fuzzy matching
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
  
  // Check similarity (word is correct if 80%+ similar)
  const isSimilar = (expected: string, recognized: string): boolean => {
    if (expected === recognized) return true;
    const maxLen = Math.max(expected.length, recognized.length);
    if (maxLen === 0) return true;
    const distance = levenshtein(expected, recognized);
    return (1 - distance / maxLen) >= 0.8;
  };
  
  // Find best match for each expected word
  expectedWords.forEach((expectedWord, idx) => {
    // Check if word exists in recognized text (with some tolerance for position)
    const searchRange = recognizedWords.slice(Math.max(0, idx - 2), idx + 3);
    const matchFound = searchRange.some(rw => isSimilar(expectedWord, rw));
    
    if (matchFound) {
      wordAnalysis.push({ word: expectedWord, status: 'correct' });
      correctCount++;
    } else {
      // Check if partially recognized (incorrect) or completely missed (skipped)
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

      console.log('Analyzing transcript:', recognizedText, 'expected:', expectedText, 'isSentence:', isSentence);

      const analysis = analyzeWords(expectedText, recognizedText);
      const correctPercent = wordCount > 0
        ? (analysis.correctCount / wordCount) * 100
        : 0;

      const pronunciationScore = Math.round(correctPercent);

      const mispronounced = [
        ...analysis.incorrectWords,
        ...analysis.skippedWords,
      ];

      let feedbackMessage: string;
      let improvementTip: string;

      if (pronunciationScore >= 90) {
        feedbackMessage = 'Excellent! Your pronunciation is very clear.';
        improvementTip = 'Keep up the great work! Try increasing your speed gradually.';
      } else if (pronunciationScore >= 70) {
        feedbackMessage = 'Good effort! A few words need some practice.';
        improvementTip = mispronounced.length > 0
          ? `Focus on: ${mispronounced.join(', ')}`
          : 'Try speaking a bit more slowly and clearly.';
      } else if (pronunciationScore >= 50) {
        feedbackMessage = 'Keep practicing! Some words were unclear.';
        improvementTip = mispronounced.length > 0
          ? `Practice these words individually: ${mispronounced.join(', ')}`
          : 'Slow down and enunciate each syllable.';
      } else {
        feedbackMessage = 'Let\'s try again. Speak slowly and clearly.';
        improvementTip = 'Break the text into smaller parts and practice each one.';
      }

      const needsWordDrill = isSentence &&
        (correctPercent < 60 || (analysis.skippedWords.length + analysis.incorrectWords.length) >= 2);

      const result: SpeechAnalysisResult = {
        recognizedText,
        pronunciationScore,
        feedbackMessage,
        improvementTip,
        mispronounced,
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
