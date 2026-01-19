import { motion } from 'framer-motion';
import { Smile, Meh, Frown, Circle, Heart } from 'lucide-react';
import { EmotionAnalysis, EmotionTag, getEmotionColor } from '@/lib/emotionDetection';
import { Badge } from '@/components/ui/badge';

interface EmotionFeedbackProps {
  analysis: EmotionAnalysis;
  showDetails?: boolean;
}

const EmotionIcon = ({ tag }: { tag: EmotionTag }) => {
  const iconClass = "w-5 h-5";
  switch (tag) {
    case 'confident':
      return <Smile className={`${iconClass} text-green-500`} />;
    case 'hesitant':
      return <Meh className={`${iconClass} text-yellow-500`} />;
    case 'nervous':
      return <Frown className={`${iconClass} text-orange-500`} />;
    default:
      return <Circle className={`${iconClass} text-muted-foreground`} />;
  }
};

const getEmotionLabel = (tag: EmotionTag): string => {
  switch (tag) {
    case 'confident':
      return 'Confident';
    case 'hesitant':
      return 'Hesitant';
    case 'nervous':
      return 'Nervous';
    default:
      return 'Neutral';
  }
};

export const EmotionFeedback = ({ analysis, showDetails = true }: EmotionFeedbackProps) => {
  const { tag, confidence, indicators, feedbackMessage, encouragement } = analysis;
  const colorClass = getEmotionColor(tag);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-3"
    >
      {/* Emotion Badge */}
      <div className="flex items-center gap-3">
        <Badge 
          variant="outline" 
          className={`${colorClass} px-3 py-1.5 flex items-center gap-2`}
        >
          <EmotionIcon tag={tag} />
          <span className="font-medium">{getEmotionLabel(tag)}</span>
          <span className="text-xs opacity-70">({confidence}%)</span>
        </Badge>
      </div>

      {/* Feedback Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`rounded-xl p-4 border ${colorClass}`}
      >
        <div className="flex items-start gap-3">
          <Heart className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <p className="text-sm font-medium">{feedbackMessage}</p>
            <p className="text-sm text-muted-foreground italic">{encouragement}</p>
          </div>
        </div>
      </motion.div>

      {/* Indicators (Optional Details) */}
      {showDetails && indicators.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-muted/30 rounded-lg p-3"
        >
          <p className="text-xs text-muted-foreground mb-2 font-medium">What we noticed:</p>
          <div className="flex flex-wrap gap-1.5">
            {indicators.map((indicator, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-background rounded-md text-muted-foreground"
              >
                {indicator}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
