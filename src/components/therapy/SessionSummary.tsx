import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  Target, 
  TrendingUp, 
  CalendarCheck,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SessionSummaryProps {
  duration: number;
  exercisesCompleted: number;
  totalExercises: number;
  accuracy: number;
  wordsPracticed: string[];
  improvementTips: string[];
}

export const SessionSummary = ({
  duration,
  exercisesCompleted,
  totalExercises,
  accuracy,
  wordsPracticed,
  improvementTips,
}: SessionSummaryProps) => {
  const navigate = useNavigate();

  const getAccuracyColor = () => {
    if (accuracy >= 80) return 'text-green-500';
    if (accuracy >= 60) return 'text-yellow-500';
    return 'text-orange-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="bg-card border-border shadow-card overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-center">
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
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center p-4 bg-muted/30 rounded-xl"
              >
                <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{duration}</p>
                <p className="text-xs text-muted-foreground">Minutes</p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center p-4 bg-muted/30 rounded-xl"
              >
                <Target className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">
                  {exercisesCompleted}/{totalExercises}
                </p>
                <p className="text-xs text-muted-foreground">Exercises</p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center p-4 bg-muted/30 rounded-xl"
              >
                <TrendingUp className={`w-5 h-5 mx-auto mb-2 ${getAccuracyColor()}`} />
                <p className={`text-2xl font-bold ${getAccuracyColor()}`}>{accuracy}%</p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </motion.div>
            </div>

            {/* Words Practiced */}
            {wordsPracticed.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <span className="text-lg">📝</span> Words Practiced
                </h3>
                <div className="flex flex-wrap gap-2">
                  {wordsPracticed.slice(0, 10).map((word, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {word}
                    </span>
                  ))}
                  {wordsPracticed.length > 10 && (
                    <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                      +{wordsPracticed.length - 10} more
                    </span>
                  )}
                </div>
              </motion.div>
            )}

            {/* Improvement Tips */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-accent/30 rounded-xl p-4"
            >
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                Improvement Tips
              </h3>
              <ul className="space-y-2">
                {improvementTips.map((tip, index) => (
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
              transition={{ delay: 0.8 }}
              className="space-y-3"
            >
              <Button
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="w-full shadow-button"
              >
                <CalendarCheck className="w-5 h-5 mr-2" />
                Continue Tomorrow
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/progress')}
                className="w-full"
              >
                View Progress
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
