import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, RefreshCw, BookOpen, AlertTriangle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { WordAnalysis } from '@/hooks/useSpeechAnalysis';
import { TherapyMode, getFeedbackLabel, getEncouragement, getTip } from '@/lib/therapyModes';

interface AIFeedbackProps {
  score: number;
  mispronounced: string[];
  suggestion: string;
  recognizedText?: string;
  improvementTip?: string;
  // Sentence-specific props
  isSentence?: boolean;
  wordAnalysis?: WordAnalysis[];
  skippedWords?: string[];
  incorrectWords?: string[];
  needsWordDrill?: boolean;
  expectedText?: string;
  therapyMode?: TherapyMode;
  onTryAgain: () => void;
  onContinue: () => void;
  onWordDrill?: (words: string[]) => void;
}

export const AIFeedback = ({ 
  score, 
  mispronounced, 
  suggestion,
  recognizedText,
  improvementTip,
  isSentence = false,
  wordAnalysis = [],
  skippedWords = [],
  incorrectWords = [],
  needsWordDrill = false,
  expectedText,
  therapyMode = 'pronunciation',
  onTryAgain, 
  onContinue,
  onWordDrill,
}: AIFeedbackProps) => {
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Use therapy mode for feedback label
  const getScoreLabel = () => getFeedbackLabel(score, therapyMode);
  
  // Get mode-specific encouragement
  const encouragement = getEncouragement(therapyMode);
  const modeTip = getTip(therapyMode);

  const getWordColor = (status: 'correct' | 'incorrect' | 'skipped') => {
    switch (status) {
      case 'correct': return 'text-green-600 bg-green-500/10';
      case 'incorrect': return 'text-orange-600 bg-orange-500/10';
      case 'skipped': return 'text-red-600 bg-red-500/10';
    }
  };

  const handleWordDrill = () => {
    if (onWordDrill) {
      const wordsToRetry = [...skippedWords, ...incorrectWords];
      onWordDrill(wordsToRetry);
    }
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
        {isSentence && (
          <Badge variant="outline" className="mt-2">
            Sentence Exercise
          </Badge>
        )}
      </div>

      {/* Word-by-Word Analysis for Sentences */}
      {isSentence && wordAnalysis.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-muted/30 rounded-xl p-4"
        >
          <p className="text-xs text-muted-foreground mb-3 font-medium flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Word-by-Word Analysis:
          </p>
          <div className="flex flex-wrap gap-2">
            {wordAnalysis.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getWordColor(word.status)}`}
              >
                {word.word}
                {word.status === 'incorrect' && ' ⚠️'}
                {word.status === 'skipped' && ' ❌'}
              </motion.span>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" /> Correct
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-500" /> Incorrect
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Skipped
            </span>
          </div>
        </motion.div>
      )}

      {/* Recognized Text */}
      {recognizedText && (
        <div className="bg-muted/50 rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1 font-medium">What we heard:</p>
          <p className="text-sm text-foreground italic">"{recognizedText}"</p>
        </div>
      )}

      {/* Skipped/Incorrect Words Alert for Sentences */}
      {isSentence && (skippedWords.length > 0 || incorrectWords.length > 0) && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-foreground">Words needing practice:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {skippedWords.map((word, index) => (
              <span
                key={`skipped-${index}`}
                className="px-3 py-1 bg-red-500/20 text-red-600 rounded-full text-sm font-medium"
              >
                {word} (skipped)
              </span>
            ))}
            {incorrectWords.map((word, index) => (
              <span
                key={`incorrect-${index}`}
                className="px-3 py-1 bg-orange-500/20 text-orange-600 rounded-full text-sm font-medium"
              >
                {word} (incorrect)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Mispronounced Sounds (for single words) */}
      {!isSentence && mispronounced.length > 0 && (
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

      {/* Feedback */}
      <div className="bg-primary/5 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Feedback:</span>
        </div>
        <p className="text-sm text-muted-foreground">{suggestion}</p>
        {/* Mode-specific encouragement */}
        <p className="text-sm text-primary mt-2 italic">{encouragement}</p>
      </div>

      {/* Improvement Tip - use mode-specific tip if no custom tip */}
      <div className="bg-accent/10 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-accent-foreground" />
          <span className="text-sm font-medium text-foreground">Tip:</span>
        </div>
        <p className="text-sm text-muted-foreground">{improvementTip || modeTip}</p>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-2">
        {/* Word Drill Button - only show if sentence needs drilling */}
        {needsWordDrill && onWordDrill && (skippedWords.length > 0 || incorrectWords.length > 0) && (
          <Button
            variant="outline"
            onClick={handleWordDrill}
            className="w-full border-orange-500/50 text-orange-600 hover:bg-orange-500/10"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Practice Individual Words ({skippedWords.length + incorrectWords.length})
          </Button>
        )}
        
        <div className="flex gap-3">
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
      </div>
    </motion.div>
  );
};
