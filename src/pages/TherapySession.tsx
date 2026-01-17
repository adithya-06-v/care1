import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  CheckCircle2,
  Pause,
  Play,
  X,
  Volume2,
  Mic
} from 'lucide-react';
import { generateExercises, getExerciseTypeName, getExerciseIcon, Exercise } from '@/lib/exerciseGenerator';

interface ProfileData {
  age_group: string | null;
  preferred_language: string | null;
  goals: string[] | null;
  difficulty: string | null;
  therapy_sessions_completed: number | null;
  total_practice_minutes: number | null;
}

const TherapySession = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();
  
  const duration = parseInt(searchParams.get('duration') || '10', 10);
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [exercisesCompleted, setExercisesCompleted] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [accuracyScores, setAccuracyScores] = useState<number[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Fetch profile and generate exercises
  useEffect(() => {
    const fetchProfileAndGenerateExercises = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('age_group, preferred_language, goals, difficulty, therapy_sessions_completed, total_practice_minutes')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data && !error) {
          setProfile(data);
          const generatedExercises = generateExercises(data, duration);
          setExercises(generatedExercises);
        }
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfileAndGenerateExercises();
    }
  }, [user, duration]);

  // Timer countdown
  useEffect(() => {
    if (isComplete || isPaused || timeRemaining <= 0) return;

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
  }, [isPaused, isComplete, timeRemaining]);

  const handleSessionComplete = useCallback(async () => {
    if (!user || isComplete) return;
    setIsComplete(true);

    // Calculate final accuracy (simulated for now - random between 70-95)
    const finalAccuracy = accuracyScores.length > 0
      ? accuracyScores.reduce((a, b) => a + b, 0) / accuracyScores.length
      : 70 + Math.random() * 25;

    try {
      // Save session to database
      const { error: sessionError } = await supabase
        .from('sessions')
        .insert({
          user_id: user.id,
          duration_minutes: duration,
          exercises_completed: exercisesCompleted,
          total_exercises: exercises.length,
          accuracy_score: Math.round(finalAccuracy * 100) / 100,
        });

      if (sessionError) throw sessionError;

      // Update profile stats
      const newSessionsCount = (profile?.therapy_sessions_completed || 0) + 1;
      const newPracticeMinutes = (profile?.total_practice_minutes || 0) + duration;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          therapy_sessions_completed: newSessionsCount,
          total_practice_minutes: newPracticeMinutes,
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      toast({
        title: 'Session Complete! 🎉',
        description: `You completed ${exercisesCompleted} exercises with ${Math.round(finalAccuracy)}% accuracy.`,
      });
    } catch (error: any) {
      console.error('Error saving session:', error);
      toast({
        title: 'Session Complete',
        description: 'There was an issue saving your progress, but great work!',
        variant: 'destructive',
      });
    }
  }, [user, isComplete, duration, exercisesCompleted, exercises.length, accuracyScores, profile]);

  const handleNextExercise = () => {
    // Simulate accuracy score for this exercise (70-95%)
    const score = 70 + Math.random() * 25;
    setAccuracyScores(prev => [...prev, score]);
    setExercisesCompleted(prev => prev + 1);

    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else if (timeRemaining > 0) {
      // Loop back to start if time remains
      setCurrentExerciseIndex(0);
    }
  };

  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
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

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your personalized session...</p>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const finalAccuracy = accuracyScores.length > 0
      ? Math.round(accuracyScores.reduce((a, b) => a + b, 0) / accuracyScores.length)
      : 85;

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-card border-border shadow-card max-w-md w-full text-center">
            <CardContent className="p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </motion.div>
              
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Session Complete! 🎉
              </h1>
              <p className="text-muted-foreground mb-6">
                Great work on your speech therapy practice!
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-3 bg-muted/30 rounded-xl">
                  <p className="text-2xl font-bold text-foreground">{duration}</p>
                  <p className="text-xs text-muted-foreground">Minutes</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-xl">
                  <p className="text-2xl font-bold text-foreground">{exercisesCompleted}</p>
                  <p className="text-xs text-muted-foreground">Exercises</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-xl">
                  <p className="text-2xl font-bold text-foreground">{finalAccuracy}%</p>
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                </div>
              </div>

              <Button 
                size="lg" 
                onClick={() => navigate('/dashboard')}
                className="w-full shadow-button"
              >
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const currentExercise = exercises[currentExerciseIndex];
  const progressPercent = ((duration * 60 - timeRemaining) / (duration * 60)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CV</span>
            </div>
            <span className="font-semibold text-foreground">Therapy Session</span>
          </div>
          
          {/* Timer */}
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className={`font-mono text-xl font-bold ${timeRemaining < 60 ? 'text-destructive' : 'text-foreground'}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleExit}
            className="text-muted-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Exit
          </Button>
        </div>
        
        {/* Progress Bar */}
        <Progress value={progressPercent} className="h-1 rounded-none" />
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Exercise Counter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Exercise {currentExerciseIndex + 1} of {exercises.length}
          </p>
          <p className="text-sm text-muted-foreground">
            {exercisesCompleted} completed
          </p>
        </div>

        {/* Exercise Card */}
        <AnimatePresence mode="wait">
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
                {/* Instruction */}
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-primary" />
                    {currentExercise?.instruction}
                  </p>
                </div>

                {/* Exercise Content */}
                <div className="p-6 bg-muted/30 rounded-xl min-h-[150px] flex items-center justify-center">
                  <p className="text-xl md:text-2xl text-foreground text-center leading-relaxed font-medium">
                    {currentExercise?.content}
                  </p>
                </div>

                {/* Microphone Indicator */}
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Mic className="w-5 h-5" />
                  <span className="text-sm">Speak clearly and at your own pace</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevExercise}
            disabled={currentExerciseIndex === 0}
            className="flex-1 max-w-[140px]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPaused(!isPaused)}
            className="w-12 h-12 rounded-full"
          >
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </Button>

          <Button
            onClick={handleNextExercise}
            className="flex-1 max-w-[140px] shadow-button"
          >
            {currentExerciseIndex === exercises.length - 1 ? 'Complete' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Pause Overlay */}
        <AnimatePresence>
          {isPaused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <Card className="bg-card border-border shadow-card p-8 text-center">
                <Pause className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold text-foreground mb-2">Session Paused</h2>
                <p className="text-muted-foreground mb-6">Take your time. Resume when ready.</p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleExit}>
                    End Session
                  </Button>
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
