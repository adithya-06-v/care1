import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SpeechAnalysisResult {
  recognizedText: string;
  pronunciationScore: number;
  feedbackMessage: string;
  improvementTip: string;
  mispronounced: string[];
}

interface UseSpeechAnalysisReturn {
  isAnalyzing: boolean;
  analyzeResult: SpeechAnalysisResult | null;
  error: string | null;
  analyzeSpeech: (audioBlob: Blob, expectedText: string) => Promise<SpeechAnalysisResult | null>;
  resetAnalysis: () => void;
}

export const useSpeechAnalysis = (): UseSpeechAnalysisReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<SpeechAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeSpeech = async (audioBlob: Blob, expectedText: string): Promise<SpeechAnalysisResult | null> => {
    setIsAnalyzing(true);
    setError(null);
    setAnalyzeResult(null);

    try {
      // Create form data with audio file and expected text
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('expectedText', expectedText);

      console.log('Sending audio for analysis, size:', audioBlob.size);

      // Call the edge function
      const { data, error: fnError } = await supabase.functions.invoke('analyze-speech', {
        body: formData,
      });

      if (fnError) {
        console.error('Edge function error:', fnError);
        throw new Error(fnError.message || 'Failed to analyze speech');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const result: SpeechAnalysisResult = {
        recognizedText: data.recognizedText,
        pronunciationScore: data.pronunciationScore,
        feedbackMessage: data.feedbackMessage,
        improvementTip: data.improvementTip || '',
        mispronounced: data.mispronounced || [],
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
