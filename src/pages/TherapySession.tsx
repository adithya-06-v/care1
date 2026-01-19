import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Pause,
  Play,
  X,
  Volume2,
  Loader2,
} from 'lucide-react';
import { generateExercises, getExerciseTypeName, getExerciseIcon, Exercise, AdaptiveData } from '@/lib/exerciseGenerator';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useSpeechAnalysis, SpeechAnalysisResult } from '@/hooks/useSpeechAnalysis';
import { useEmotionTracker } from '@/hooks/useEmotionTracker';
import { RecordingButton } from '@/components/therapy/RecordingButton';
import { AIFeedback } from '@/components/therapy/AIFeedback';
import { SessionSummary } from '@/components/therapy/SessionSummary';
import { 
  updateExerciseProgress, 
  updateDifficultyProgression,
  getWeakExercises,
  getMasteredExercises,
  getWeakPhonemePatterns,
  getUserDifficultyProgress
} from '@/lib/adaptiveDifficulty';
import { getWeakSoundsForExercises, SOUND_PATTERNS, SoundPattern } from '@/lib/weakSoundAnalysis';
import { TherapyMode } from '@/lib/therapyModes';
import { EmotionAnalysis, EmotionTag } from '@/lib/emotionDetection';

interface ProfileData {
  age_group: string | null;
  preferred_language: string | null;
  goals: string[] | null;
  difficulty: string | null;
  therapy_sessions_completed: number | null;
  total_practice_minutes: number | null;
  current_streak: number | null;
  longest_streak: number | null;
  last_session_date: string | null;
  therapy_mode: TherapyMode | null;
}

const TherapySession = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();
  const { isPro, isLoading: subscriptionLoading, createCheckout } = useSubscription();
  
  const duration = parseInt(searchParams.get('duration') || '10', 10);
  const sessionMode = searchParams.get('mode'); // 'focused' mode for sound-focused practice
  const [sessionLimitReached, setSessionLimitReached] = useState(false);
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [exercisesCompleted, setExercisesCompleted] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [accuracyScores, setAccuracyScores] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<SpeechAnalysisResult | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionCreated, setSessionCreated] = useState(false);
  const [currentEmotionAnalysis, setCurrentEmotionAnalysis] = useState<EmotionAnalysis | null>(null);

  const { isRecording, audioBlob, audioUrl, startRecording, stopRecording, resetRecording, recordingDuration } = useAudioRecorder();
  const { isAnalyzing, analyzeSpeech, resetAnalysis } = useSpeechAnalysis();
  const { 
    metrics: emotionMetrics, 
    trackRecordingStart, 
    trackRecordingEnd, 
    trackRetry, 
    analyzeEmotion, 
    resetTracking: resetEmotionTracking,
    getEmotionTag 
  } = useEmotionTracker();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Check daily session limit for free users
  useEffect(() => {
    const checkSessionLimit = async () => {
      if (!user || isPro || subscriptionLoading) return;

      const today = new Date().toISOString().split('T')[0];
      const { count, error } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', `${today}T00:00:00.000Z`);

      if (!error && count !== null && count >= 5) {
        setSessionLimitReached(true);
      }
    };

    checkSessionLimit();
  }, [user, isPro, subscriptionLoading]);

  useEffect(() => {
    const fetchProfileAndGenerateExercises = async () => {
      if (user) {
        // Fetch profile
        const { data, error } = await supabase
          .from('profiles')
          .select('age_group, preferred_language, goals, difficulty, therapy_sessions_completed, total_practice_minutes, current_streak, longest_streak, last_session_date, therapy_mode')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data && !error) {
          setProfile({
            ...data,
            therapy_mode: (data.therapy_mode as TherapyMode) || 'pronunciation',
          });
          
          // Fetch adaptive data for exercise generation
          const [weakExercises, masteredExercises, weakPhonemes, difficultyProgress, weakSounds] = await Promise.all([
            getWeakExercises(user.id),
            getMasteredExercises(user.id),
            getWeakPhonemePatterns(user.id),
            getUserDifficultyProgress(user.id),
            getWeakSoundsForExercises(user.id),
          ]);
          
          const adaptiveData: AdaptiveData = {
            weakExercises,
            masteredExercises,
            weakPhonemes,
            currentDifficulty: difficultyProgress?.current_difficulty || (data.difficulty as 'beginner' | 'moderate' | 'severe') || 'beginner',
            weakSounds, // Add weak sounds for prioritization
          };
          
          // Check for focused mode with stored sound data
          if (sessionMode === 'focused') {
            const focusedData = sessionStorage.getItem('focusedSound');
            if (focusedData) {
              try {
                const { sound, practiceSet } = JSON.parse(focusedData) as { 
                  sound: SoundPattern; 
                  practiceSet: { words: string[]; sentences: string[] };
                };
                
                // Generate focused exercises from the sound pattern
                const focusedExercises: Exercise[] = [];
                
                // Add word exercises
                practiceSet.words.forEach((word, index) => {
                  focusedExercises.push({
                    id: `focused-word-${index}-${Date.now()}`,
                    type: 'word_repetition',
                    title: `${sound.displayName} Sound Practice`,
                    instruction: `Practice the "${sound.displayName}" sound in this word`,
                    content: word,
                    difficulty: 'beginner',
                    targetGoal: 'pronunciation',
                  });
                });
                
                // Add sentence exercises
                practiceSet.sentences.forEach((sentence, index) => {
                  focusedExercises.push({
                    id: `focused-sentence-${index}-${Date.now()}`,
                    type: 'sentence_reading',
                    title: `${sound.displayName} Sound Sentence`,
                    instruction: `Read this sentence focusing on the "${sound.displayName}" sound`,
                    content: sentence,
                    difficulty: 'moderate',
                    targetGoal: 'pronunciation',
                  });
                });
                
                setExercises(focusedExercises);
                sessionStorage.removeItem('focusedSound');
                setIsLoading(false);
                return;
              } catch (e) {
                console.error('Error parsing focused sound data:', e);
              }
            }
          }
          
          // Generate exercises with adaptive data
          const generatedExercises = generateExercises(data, duration, adaptiveData);
          setExercises(generatedExercises);
        }
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfileAndGenerateExercises();
    }
  }, [user, duration]);

  useEffect(() => {
    if (isComplete || isPaused || timeRemaining <= 0 || showFeedback) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSessionComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isComplete, timeRemaining, showFeedback]);

  const updateStreak = async () => {
    if (!user || !profile) return;

    const today = new Date().toISOString().split('T')[0];
    const lastSession = profile.last_session_date;
    let newStreak = profile.current_streak || 0;
    let longestStreak = profile.longest_streak || 0;

    if (!lastSession) {
      newStreak = 1;
    } else {
      const lastDate = new Date(lastSession);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    }

    if (newStreak > longestStreak) {
      longestStreak = newStreak;
    }

    await supabase
      .from('profiles')
      .update({
        current_streak: newStreak,
        longest_streak: longestStreak,
        last_session_date: today,
      })
      .eq('user_id', user.id);
  };

  const handleSessionComplete = useCallback(async () => {
    if (!user || isComplete) return;
    setIsComplete(true);

    const finalAccuracy = accuracyScores.length > 0
      ? accuracyScores.reduce((a, b) => a + b, 0) / accuracyScores.length
      : 0;

    try {
      // If session was already created during exercises, just update final stats
      if (currentSessionId && sessionCreated) {
        await supabase
          .from('sessions')
          .update({
            total_exercises: exercises.length,
            accuracy_score: Math.round(finalAccuracy * 100) / 100,
          })
          .eq('id', currentSessionId);
      } else if (exercisesCompleted > 0) {
        // Session wasn't created but exercises were completed (edge case)
        await supabase.from('sessions').insert({
          user_id: user.id,
          duration_minutes: duration,
          exercises_completed: exercisesCompleted,
          total_exercises: exercises.length,
          accuracy_score: Math.round(finalAccuracy * 100) / 100,
        });
      }

      // Only update profile stats if exercises were completed
      if (exercisesCompleted > 0) {
        const newSessionsCount = (profile?.therapy_sessions_completed || 0) + 1;
        const newPracticeMinutes = (profile?.total_practice_minutes || 0) + duration;

        await supabase.from('profiles').update({
          therapy_sessions_completed: newSessionsCount,
          total_practice_minutes: newPracticeMinutes,
        }).eq('user_id', user.id);

        await updateStreak();
        
        // Update difficulty progression for next session
        await updateDifficultyProgression(user.id, finalAccuracy);
      }

      toast({
        title: exercisesCompleted > 0 ? 'Session Complete! 🎉' : 'Session Ended',
        description: exercisesCompleted > 0 
          ? `You completed ${exercisesCompleted} exercises with ${Math.round(finalAccuracy)}% accuracy.`
          : 'No exercises were completed this session.',
      });
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }, [user, isComplete, duration, exercisesCompleted, exercises.length, accuracyScores, profile, currentSessionId, sessionCreated]);

  // Create session record on first exercise completion (not at end of timer)
  const createOrGetSessionId = async (): Promise<string | null> => {
    if (!user) return null;
    
    // If session already exists, return it
    if (currentSessionId) return currentSessionId;
    
    try {
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .insert({
          user_id: user.id,
          duration_minutes: duration,
          exercises_completed: 0,
          total_exercises: exercises.length,
          accuracy_score: 0,
        })
        .select('id')
        .single();

      if (sessionError) {
        console.error('Error creating session:', sessionError);
        return null;
      }
      
      if (sessionData) {
        setCurrentSessionId(sessionData.id);
        setSessionCreated(true);
        return sessionData.id;
      }
      return null;
    } catch (error) {
      console.error('Error creating session:', error);
      return null;
    }
  };

  // Update session stats in real-time
  const updateSessionStats = async (sessionId: string, newScore: number) => {
    if (!user || !sessionId) return;
    
    try {
      // Get current session data to calculate new average
      const { data: currentSession } = await supabase
        .from('sessions')
        .select('exercises_completed, accuracy_score')
        .eq('id', sessionId)
        .single();
      
      if (currentSession) {
        const currentCompleted = currentSession.exercises_completed || 0;
        const currentAccuracy = currentSession.accuracy_score || 0;
        
        // Calculate new average accuracy
        const newCompleted = currentCompleted + 1;
        const newAvgAccuracy = ((currentAccuracy * currentCompleted) + newScore) / newCompleted;
        
        await supabase
          .from('sessions')
          .update({
            exercises_completed: newCompleted,
            accuracy_score: Math.round(newAvgAccuracy * 100) / 100,
          })
          .eq('id', sessionId);
        
        console.log(`Session updated: ${newCompleted} exercises, ${Math.round(newAvgAccuracy)}% avg accuracy`);
      }
    } catch (error) {
      console.error('Error updating session stats:', error);
    }
  };

  const saveExerciseResult = async (result: SpeechAnalysisResult, exerciseText: string, emotionTag: EmotionTag = 'neutral') => {
    if (!user) return;
    
    try {
      // Create session if it doesn't exist yet
      const sessionId = await createOrGetSessionId();
      
      // Save the exercise result immediately with emotion tag
      await supabase.from('exercise_results').insert({
        user_id: user.id,
        session_id: sessionId,
        exercise_text: exerciseText,
        recognized_text: result.recognizedText,
        score: result.pronunciationScore,
        feedback: result.feedbackMessage,
        improvement_tip: result.improvementTip,
        emotion_tag: emotionTag,
      });
      
      // Save sentence performance separately if it's a sentence
      if (result.isSentence) {
        const wordCount = exerciseText.split(/\s+/).filter(Boolean).length;
        const correctWords = result.wordAnalysis.filter(w => w.status === 'correct').length;
        
        await supabase.from('sentence_performance').insert({
          user_id: user.id,
          session_id: sessionId,
          sentence_text: exerciseText,
          recognized_text: result.recognizedText,
          accuracy_score: result.pronunciationScore,
          word_count: wordCount,
          correct_words: correctWords,
          skipped_words: result.skippedWords,
          incorrect_words: result.incorrectWords,
          needs_word_drill: result.needsWordDrill,
        });
        
        console.log(`Sentence performance saved: ${correctWords}/${wordCount} words correct`);
      }
      
      // Update session stats in real-time
      if (sessionId) {
        await updateSessionStats(sessionId, result.pronunciationScore);
      }
      
      // Update adaptive difficulty tracking
      // Score > 85 → mastered, 60-85 → learning, < 60 → weak
      await updateExerciseProgress(user.id, exerciseText, result.pronunciationScore);
      
      // Increment local completed count immediately
      setExercisesCompleted(prev => prev + 1);
      setAccuracyScores(prev => [...prev, result.pronunciationScore]);
      
      console.log(`Exercise saved: ${result.pronunciationScore}% - Emotion: ${emotionTag} - Status: ${
        result.pronunciationScore > 85 ? 'mastered' : 
        result.pronunciationScore >= 60 ? 'learning' : 'weak'
      }`);
    } catch (error) {
      console.error('Error saving exercise result:', error);
    }
  };

  // Handle word drill - insert word exercises into the session
  const handleWordDrill = (words: string[]) => {
    if (words.length === 0) return;
    
    // Create word exercises from the problem words
    const wordExercises: Exercise[] = words.map((word, index) => ({
      id: `word-drill-${index}-${Date.now()}`,
      type: 'word_repetition' as const,
      title: 'Word Practice',
      instruction: 'Practice this word clearly and slowly',
      content: word,
      difficulty: 'beginner' as const,
      targetGoal: 'pronunciation',
    }));
    
    // Insert word exercises after current exercise
    const newExercises = [...exercises];
    newExercises.splice(currentExerciseIndex + 1, 0, ...wordExercises);
    setExercises(newExercises);
    
    // Move to next exercise (first word drill)
    setShowFeedback(false);
    setCurrentFeedback(null);
    resetRecording();
    resetAnalysis();
    setCurrentExerciseIndex(prev => prev + 1);
    
    toast({
      title: `Word Drill Started`,
      description: `Let's practice ${words.length} word${words.length > 1 ? 's' : ''} individually.`,
    });
  };

  const handleRecordingComplete = async () => {
    if (audioBlob) {
      const currentExercise = exercises[currentExerciseIndex];
      const expectedText = currentExercise?.content || '';
      
      // Track recording end for emotion detection
      trackRecordingEnd(recordingDuration);
      
      const result = await analyzeSpeech(audioBlob, expectedText);
      
      if (result) {
        // Analyze emotion based on recording metrics and pronunciation score
        const emotionResult = analyzeEmotion(result.pronunciationScore);
        setCurrentEmotionAnalysis(emotionResult);
        
        setCurrentFeedback(result);
        setShowFeedback(true);
        // Save the exercise result to Supabase with emotion tag
        await saveExerciseResult(result, expectedText, emotionResult.tag);
      } else {
        toast({
          title: 'Analysis failed',
          description: 'Could not analyze your speech. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleFeedbackContinue = () => {
    // Stats already saved in saveExerciseResult, just navigate to next exercise
    setShowFeedback(false);
    setCurrentFeedback(null);
    setCurrentEmotionAnalysis(null);
    resetRecording();
    resetAnalysis();
    resetEmotionTracking();

    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else if (timeRemaining > 0) {
      setCurrentExerciseIndex(0);
    }
  };

  const handleTryAgain = () => {
    setShowFeedback(false);
    setCurrentFeedback(null);
    setCurrentEmotionAnalysis(null);
    resetRecording();
    resetAnalysis();
    // Track retry for emotion detection
    trackRetry();
  };

  const handleNextExercise = () => {
    if (audioBlob) {
      handleRecordingComplete();
    } else {
      const score = 70 + Math.random() * 25;
      setAccuracyScores(prev => [...prev, score]);
      setExercisesCompleted(prev => prev + 1);

      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
      } else if (timeRemaining > 0) {
        setCurrentExerciseIndex(0);
      }
      resetRecording();
    }
  };

  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      resetRecording();
      setShowFeedback(false);
    }
  };

  const handleExit = () => {
    if (!isComplete && exercisesCompleted > 0) {
      handleSessionComplete();
    }
    navigate('/dashboard');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading || isLoading || subscriptionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your personalized session...</p>
        </div>
      </div>
    );
  }

  // Show session limit reached screen for free users
  if (sessionLimitReached && !isPro) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full bg-card border-border shadow-card">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-xl text-foreground">Daily Limit Reached</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              You've completed 5 sessions today on the free plan. Upgrade to Pro for unlimited sessions!
            </p>
            <div className="space-y-3">
              <Button 
                onClick={async () => {
                  try {
                    await createCheckout();
                  } catch (error) {
                    toast({
                      title: 'Error',
                      description: 'Failed to start checkout. Please try again.',
                      variant: 'destructive',
                    });
                  }
                }}
                className="w-full rounded-pill shadow-button"
              >
                Upgrade to Pro — $20/mo
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="w-full"
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <SessionSummary
        sessionId={currentSessionId}
        duration={duration}
        exercisesCompleted={exercisesCompleted}
        totalExercises={exercises.length}
      />
    );
  }

  const currentExercise = exercises[currentExerciseIndex];
  const progressPercent = ((duration * 60 - timeRemaining) / (duration * 60)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CV</span>
            </div>
            <span className="font-semibold text-foreground">Therapy Session</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className={`font-mono text-xl font-bold ${timeRemaining < 60 ? 'text-destructive' : 'text-foreground'}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>

          <Button variant="ghost" size="sm" onClick={handleExit} className="text-muted-foreground">
            <X className="w-4 h-4 mr-1" />
            Exit
          </Button>
        </div>
        
        <Progress value={progressPercent} className="h-1 rounded-none" />
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Exercise {currentExerciseIndex + 1} of {exercises.length}
          </p>
          <p className="text-sm text-muted-foreground">
            {exercisesCompleted} completed
          </p>
        </div>

        <AnimatePresence mode="wait">
          {showFeedback && currentFeedback ? (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <AIFeedback
                score={currentFeedback.pronunciationScore}
                mispronounced={currentFeedback.mispronounced}
                suggestion={currentFeedback.feedbackMessage}
                recognizedText={currentFeedback.recognizedText}
                improvementTip={currentFeedback.improvementTip}
                isSentence={currentFeedback.isSentence}
                wordAnalysis={currentFeedback.wordAnalysis}
                skippedWords={currentFeedback.skippedWords}
                incorrectWords={currentFeedback.incorrectWords}
                needsWordDrill={currentFeedback.needsWordDrill}
                expectedText={exercises[currentExerciseIndex]?.content}
                therapyMode={profile?.therapy_mode || 'pronunciation'}
                emotionAnalysis={currentEmotionAnalysis}
                onTryAgain={handleTryAgain}
                onContinue={handleFeedbackContinue}
                onWordDrill={handleWordDrill}
              />
            </motion.div>
          ) : (
            <motion.div
              key={currentExercise?.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-card border-border shadow-card mb-6">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{getExerciseIcon(currentExercise?.type || 'pronunciation')}</span>
                    <div>
                      <p className="text-xs text-primary font-medium uppercase tracking-wide">
                        {getExerciseTypeName(currentExercise?.type || 'pronunciation')}
                      </p>
                      <CardTitle className="text-xl text-foreground">
                        {currentExercise?.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-primary" />
                      {currentExercise?.instruction}
                    </p>
                  </div>

                  <div className="p-6 bg-muted/30 rounded-xl min-h-[120px] flex items-center justify-center">
                    <p className="text-xl md:text-2xl text-foreground text-center leading-relaxed font-medium">
                      {currentExercise?.content}
                    </p>
                  </div>

                  {isAnalyzing ? (
                    <div className="flex flex-col items-center gap-3 py-4">
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                      <p className="text-sm text-muted-foreground">Analyzing your speech...</p>
                    </div>
                  ) : (
                    <RecordingButton
                      isRecording={isRecording}
                      hasRecording={!!audioBlob}
                      audioUrl={audioUrl}
                      duration={recordingDuration}
                      onStartRecording={() => {
                        trackRecordingStart();
                        startRecording();
                      }}
                      onStopRecording={stopRecording}
                      onResetRecording={resetRecording}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {!showFeedback && (
          <div className="flex items-center justify-between gap-4">
            <Button variant="outline" onClick={handlePrevExercise} disabled={currentExerciseIndex === 0} className="flex-1 max-w-[140px]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button variant="outline" size="icon" onClick={() => setIsPaused(!isPaused)} className="w-12 h-12 rounded-full">
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </Button>

            <Button onClick={handleNextExercise} disabled={isAnalyzing} className="flex-1 max-w-[140px] shadow-button">
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {audioBlob ? 'Submit' : currentExerciseIndex === exercises.length - 1 ? 'Complete' : 'Skip'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}

        <AnimatePresence>
          {isPaused && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
              <Card className="bg-card border-border shadow-card p-8 text-center">
                <Pause className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold text-foreground mb-2">Session Paused</h2>
                <p className="text-muted-foreground mb-6">Take your time. Resume when ready.</p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleExit}>End Session</Button>
                  <Button onClick={() => setIsPaused(false)} className="shadow-button">
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default TherapySession;
