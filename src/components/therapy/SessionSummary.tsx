import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  Target, 
  TrendingUp, 
  CalendarCheck,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ProBadge } from '@/components/ui/pro-badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ExerciseResult {
  id: string;
  exercise_text: string;
  recognized_text: string | null;
  score: number | null;
  feedback: string | null;
  improvement_tip: string | null;
}

interface SessionSummaryProps {
  sessionId: string | null;
  duration: number;
  exercisesCompleted: number;
  totalExercises: number;
}

export const SessionSummary = ({
  sessionId,
  duration,
  exercisesCompleted,
  totalExercises,
}: SessionSummaryProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [exerciseResults, setExerciseResults] = useState<ExerciseResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Calculated stats
  const averageScore = exerciseResults.length > 0
    ? Math.round(exerciseResults.reduce((sum, r) => sum + (r.score || 0), 0) / exerciseResults.length)
    : 0;
  
  const goodAttempts = exerciseResults.filter(r => (r.score || 0) >= 80).length;
  const incorrectAttempts = exerciseResults.filter(r => (r.score || 0) < 80).length;
  const weakExercises = exerciseResults.filter(r => (r.score || 0) < 70);

  // Fetch exercise results from Supabase
  useEffect(() => {
    const fetchResults = async () => {
      if (!user || !sessionId) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('exercise_results')
        .select('id, exercise_text, recognized_text, score, feedback, improvement_tip')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (data && !error) {
        setExerciseResults(data);
      }
      setIsLoading(false);
    };

    fetchResults();
  }, [user, sessionId]);

  // Animate the score
  useEffect(() => {
    if (averageScore > 0) {
      const duration = 1500;
      const steps = 60;
      const increment = averageScore / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= averageScore) {
          setAnimatedScore(averageScore);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.round(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [averageScore]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const getImprovementSuggestions = (): string[] => {
    const suggestions: string[] = [];
    
    if (weakExercises.length > 0) {
      const weakWords = weakExercises.map(e => e.exercise_text).slice(0, 3);
      suggestions.push(`Focus on practicing: ${weakWords.join(', ')}`);
    }
    
    if (averageScore < 60) {
      suggestions.push('Try speaking more slowly and clearly');
      suggestions.push('Practice each word individually before attempting sentences');
    } else if (averageScore < 80) {
      suggestions.push('Great progress! Focus on challenging sounds');
      suggestions.push('Record yourself and compare with native speakers');
    } else {
      suggestions.push('Excellent work! Try increasing difficulty level');
      suggestions.push('Practice with longer sentences and phrases');
    }

    // Add unique tips from exercise results
    const uniqueTips = [...new Set(exerciseResults
      .filter(r => r.improvement_tip)
      .map(r => r.improvement_tip))]
      .slice(0, 2);
    
    suggestions.push(...uniqueTips.filter(Boolean) as string[]);

    return suggestions.slice(0, 4);
  };

  const handleRetryWeakWords = () => {
    // Store weak words in sessionStorage for the new session
    const weakWords = weakExercises.map(e => e.exercise_text);
    sessionStorage.setItem('retryExercises', JSON.stringify(weakWords));
    navigate('/therapy-session?duration=5&mode=retry');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading session results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-card border-border shadow-card overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-center relative">
            <div className="absolute top-4 right-4">
              <ProBadge size="md" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Session Complete! 🎉
            </h1>
            <p className="text-white/80 text-sm">
              Great work on your speech therapy practice!
            </p>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Large Animated Score */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-4"
            >
              <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
              <div className={`text-6xl font-bold ${getScoreColor(averageScore)} mb-4`}>
                {animatedScore}%
              </div>
              <div className="max-w-md mx-auto">
                <Progress 
                  value={animatedScore} 
                  className="h-3 bg-muted"
                />
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-3">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center p-3 bg-muted/30 rounded-xl"
              >
                <Clock className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{duration}</p>
                <p className="text-xs text-muted-foreground">Minutes</p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center p-3 bg-muted/30 rounded-xl"
              >
                <Target className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">
                  {exerciseResults.length || exercisesCompleted}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center p-3 bg-green-500/10 rounded-xl"
              >
                <CheckCircle className="w-4 h-4 text-green-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-green-500">{goodAttempts}</p>
                <p className="text-xs text-muted-foreground">Good</p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center p-3 bg-red-500/10 rounded-xl"
              >
                <XCircle className="w-4 h-4 text-red-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-red-500">{incorrectAttempts}</p>
                <p className="text-xs text-muted-foreground">Needs Work</p>
              </motion.div>
            </div>

            {/* Exercise Results List */}
            {exerciseResults.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <span className="text-lg">📝</span> Exercise Results
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {exerciseResults.map((result, index) => (
                    <div
                      key={result.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        (result.score || 0) < 70 
                          ? 'bg-red-500/10 border border-red-500/20' 
                          : 'bg-muted/30'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${
                          (result.score || 0) < 70 ? 'text-red-500' : 'text-foreground'
                        }`}>
                          {result.exercise_text}
                        </p>
                        {result.recognized_text && (
                          <p className="text-xs text-muted-foreground truncate">
                            Heard: {result.recognized_text}
                          </p>
                        )}
                      </div>
                      <Badge variant={getScoreBadgeVariant(result.score || 0)}>
                        {result.score || 0}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Weak Words Alert */}
            {weakExercises.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">
                      {weakExercises.length} word{weakExercises.length > 1 ? 's' : ''} need more practice
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {weakExercises.slice(0, 5).map((exercise, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-orange-500/20 text-orange-600 rounded text-sm"
                        >
                          {exercise.exercise_text}
                        </span>
                      ))}
                      {weakExercises.length > 5 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-sm">
                          +{weakExercises.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Improvement Tips */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="bg-accent/30 rounded-xl p-4"
            >
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                Improvement Suggestions
              </h3>
              <ul className="space-y-2">
                {getImprovementSuggestions().map((tip, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="space-y-3"
            >
              {weakExercises.length > 0 && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleRetryWeakWords}
                  className="w-full border-orange-500/50 text-orange-600 hover:bg-orange-500/10"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Retry Weak Words ({weakExercises.length})
                </Button>
              )}
              <Button
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="w-full shadow-button"
              >
                <CalendarCheck className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/progress')}
                className="w-full"
              >
                View Full Progress
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
