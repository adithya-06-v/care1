import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Play, Clock } from 'lucide-react';

interface Profile {
  goals: string[] | null;
  difficulty: string | null;
  age_group: string | null;
}

interface SessionStats {
  averageAccuracy: number;
  totalSessions: number;
}

interface RecommendedSessionProps {
  profile: Profile | null;
  stats: SessionStats;
}

// Recommendations based on user profile and performance
const getRecommendation = (profile: Profile | null, stats: SessionStats) => {
  const goals = profile?.goals || ['pronunciation'];
  const difficulty = profile?.difficulty || 'beginner';
  const accuracy = stats.averageAccuracy;
  const sessions = stats.totalSessions;

  // Determine focus area based on goals
  let focusArea = goals[0] || 'pronunciation';
  let specificFocus = '';
  let duration = 10;
  let emoji = '🗣️';

  // Adjust based on accuracy
  if (accuracy < 60 && sessions > 2) {
    duration = 7;
    specificFocus = 'basic sounds to build confidence';
    emoji = '🌟';
  } else if (accuracy < 75 && sessions > 3) {
    specificFocus = 'challenging sounds you\'ve struggled with';
    emoji = '💪';
  } else if (accuracy >= 85 && sessions > 5) {
    duration = 15;
    specificFocus = 'advanced patterns to challenge yourself';
    emoji = '🚀';
  }

  // Goal-specific recommendations
  if (focusArea === 'pronunciation') {
    const sounds = ['R', 'S', 'TH', 'L', 'V', 'W'];
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
    if (!specificFocus) {
      specificFocus = `"${randomSound}" sounds`;
    }
    emoji = '🗣️';
  } else if (focusArea === 'fluency') {
    if (!specificFocus) {
      specificFocus = 'breathing and pacing exercises';
    }
    emoji = '🌬️';
  } else if (focusArea === 'accent') {
    if (!specificFocus) {
      specificFocus = 'intonation and stress patterns';
    }
    emoji = '🎭';
  } else if (focusArea === 'vocabulary') {
    if (!specificFocus) {
      specificFocus = 'new vocabulary in context';
    }
    emoji = '📚';
  } else if (focusArea === 'confidence') {
    if (!specificFocus) {
      specificFocus = 'positive affirmations and presentation';
    }
    emoji = '💫';
  }

  // Child-specific adjustments
  if (profile?.age_group === 'child') {
    duration = Math.min(duration, 10);
    emoji = '🎮';
    specificFocus = 'fun sounds and games';
  }

  return {
    focusArea,
    specificFocus,
    duration,
    emoji,
    difficulty,
  };
};

export const RecommendedSession = ({ profile, stats }: RecommendedSessionProps) => {
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState(getRecommendation(profile, stats));

  useEffect(() => {
    setRecommendation(getRecommendation(profile, stats));
  }, [profile, stats]);

  const handleStartRecommended = () => {
    navigate(`/therapy-session?duration=${recommendation.duration}`);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border-primary/20 shadow-card overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-3xl">{recommendation.emoji}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-primary uppercase tracking-wide">
                  Recommended for you
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {recommendation.duration}-minute {recommendation.focusArea} drill
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Focusing on {recommendation.specificFocus}
              </p>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleStartRecommended}
                  className="shadow-button"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Now
                </Button>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{recommendation.duration} min</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
