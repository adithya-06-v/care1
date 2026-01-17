import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface AIFeedbackProps {
  score: number;
  mispronounced: string[];
  suggestion: string;
  onTryAgain: () => void;
  onContinue: () => void;
}

export const AIFeedback = ({ 
  score, 
  mispronounced, 
  suggestion, 
  onTryAgain, 
  onContinue 
}: AIFeedbackProps) => {
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = () => {
    if (score >= 90) return 'Excellent!';
    if (score >= 80) return 'Great job!';
    if (score >= 70) return 'Good effort!';
    if (score >= 60) return 'Keep practicing!';
    return 'Try again!';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-6 space-y-4"
    >
      {/* Score Section */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className={`text-5xl font-bold ${getScoreColor()}`}
        >
          {score}%
        </motion.div>
        <p className="text-lg font-medium text-foreground mt-1">{getScoreLabel()}</p>
        <Progress value={score} className="h-2 mt-3" />
      </div>

      {/* Mispronounced Sounds */}
      {mispronounced.length > 0 && (
        <div className="bg-destructive/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm font-medium text-foreground">Sounds to practice:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {mispronounced.map((sound, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-destructive/20 text-destructive rounded-full text-sm font-medium"
              >
                {sound}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestion */}
      <div className="bg-primary/5 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Tip:</span>
        </div>
        <p className="text-sm text-muted-foreground">{suggestion}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onTryAgain}
          className="flex-1"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
        <Button
          onClick={onContinue}
          className="flex-1 shadow-button"
        >
          Continue
        </Button>
      </div>
    </motion.div>
  );
};
