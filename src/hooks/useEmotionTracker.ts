import { useState, useCallback, useRef } from 'react';
import { RecordingMetrics, EmotionAnalysis, detectEmotion, EmotionTag } from '@/lib/emotionDetection';

interface UseEmotionTrackerReturn {
  metrics: RecordingMetrics;
  emotionAnalysis: EmotionAnalysis | null;
  trackRecordingStart: () => void;
  trackRecordingEnd: (audioDuration: number) => void;
  trackPause: (pauseDuration: number) => void;
  trackRetry: () => void;
  analyzeEmotion: (pronunciationScore: number) => EmotionAnalysis;
  resetTracking: () => void;
  getEmotionTag: () => EmotionTag;
}

const initialMetrics: RecordingMetrics = {
  totalDuration: 0,
  pauseCount: 0,
  longestPause: 0,
  retryCount: 0,
  startDelay: 0,
  averagePauseDuration: 0,
};

export const useEmotionTracker = (): UseEmotionTrackerReturn => {
  const [metrics, setMetrics] = useState<RecordingMetrics>(initialMetrics);
  const [emotionAnalysis, setEmotionAnalysis] = useState<EmotionAnalysis | null>(null);
  
  const recordingStartTime = useRef<number>(0);
  const pauseDurations = useRef<number[]>([]);

  const trackRecordingStart = useCallback(() => {
    recordingStartTime.current = Date.now();
    // Track initial delay (simulate detecting when user actually starts speaking)
    // In a real implementation, this would use audio analysis
    const randomDelay = Math.random() * 2; // Simulate 0-2 second delay
    setMetrics(prev => ({
      ...prev,
      startDelay: randomDelay,
    }));
  }, []);

  const trackRecordingEnd = useCallback((audioDuration: number) => {
    const totalDuration = audioDuration;
    
    // Simulate pause detection based on duration
    // In real implementation, this would analyze audio waveform
    const estimatedPauses = Math.floor(totalDuration / 3); // Rough estimate
    const simulatedPauseCount = Math.max(0, estimatedPauses + Math.floor(Math.random() * 3) - 1);
    
    // Calculate metrics
    const avgPause = pauseDurations.current.length > 0
      ? pauseDurations.current.reduce((a, b) => a + b, 0) / pauseDurations.current.length
      : simulatedPauseCount > 0 ? 0.5 + Math.random() * 1.5 : 0;
    
    const longestPause = pauseDurations.current.length > 0
      ? Math.max(...pauseDurations.current)
      : simulatedPauseCount > 0 ? avgPause * 1.5 : 0;

    setMetrics(prev => ({
      ...prev,
      totalDuration,
      pauseCount: prev.pauseCount + simulatedPauseCount,
      longestPause: Math.max(prev.longestPause, longestPause),
      averagePauseDuration: avgPause,
    }));
  }, []);

  const trackPause = useCallback((pauseDuration: number) => {
    pauseDurations.current.push(pauseDuration);
    setMetrics(prev => ({
      ...prev,
      pauseCount: prev.pauseCount + 1,
      longestPause: Math.max(prev.longestPause, pauseDuration),
    }));
  }, []);

  const trackRetry = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      retryCount: prev.retryCount + 1,
    }));
    // Reset pause tracking for new attempt
    pauseDurations.current = [];
  }, []);

  const analyzeEmotion = useCallback((pronunciationScore: number): EmotionAnalysis => {
    const analysis = detectEmotion(metrics, pronunciationScore);
    setEmotionAnalysis(analysis);
    return analysis;
  }, [metrics]);

  const getEmotionTag = useCallback((): EmotionTag => {
    return emotionAnalysis?.tag || 'neutral';
  }, [emotionAnalysis]);

  const resetTracking = useCallback(() => {
    setMetrics(initialMetrics);
    setEmotionAnalysis(null);
    pauseDurations.current = [];
    recordingStartTime.current = 0;
  }, []);

  return {
    metrics,
    emotionAnalysis,
    trackRecordingStart,
    trackRecordingEnd,
    trackPause,
    trackRetry,
    analyzeEmotion,
    resetTracking,
    getEmotionTag,
  };
};
