import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTodaysFocus, TodaysFocus as TodaysFocusType, SoundPattern } from '@/lib/weakSoundAnalysis';

interface TodaysFocusProps {
  userId: string;
}

export const TodaysFocus = ({ userId }: TodaysFocusProps) => {
  const navigate = useNavigate();
  const [focus, setFocus] = useState<TodaysFocusType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFocus = async () => {
      setIsLoading(true);
      try {
        const focusData = await getTodaysFocus(userId);
        setFocus(focusData);
      } catch (error) {
        console.error('Error fetching today\'s focus:', error);
      }
      setIsLoading(false);
    };

    if (userId) {
      fetchFocus();
    }
  }, [userId]);

  const handleStartFocusedSession = () => {
    if (focus?.primarySound) {
      // Store focus data for the therapy session
      sessionStorage.setItem('focusedSound', JSON.stringify({
        sound: focus.primarySound,
        practiceSet: focus.miniPracticeSet,
      }));
      navigate('/therapy-session?duration=5&mode=focused');
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 border-primary/20 shadow-card">
        <CardContent className="p-6 flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  // No weak sounds detected - show encouraging message
  if (!focus || !focus.primarySound) {
    return (
      <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20 shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-foreground text-base">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            Today's Focus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-lg font-medium text-foreground mb-2">
              You're doing great! 🎉
            </p>
            <p className="text-sm text-muted-foreground">
              No specific sounds need extra practice. Keep up the excellent work!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { primarySound, secondarySounds, miniPracticeSet, totalWeakSounds } = focus;

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 border-primary/20 shadow-card overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground text-base">
            <Target className="w-5 h-5 text-primary" />
            Today's Focus
          </CardTitle>
          {totalWeakSounds > 1 && (
            <Badge variant="secondary" className="text-xs">
              {totalWeakSounds} sounds to practice
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Sound Focus */}
        <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Volume2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Practice the</p>
              <p className="text-2xl font-bold text-primary">
                "{primarySound.displayName}" Sound
              </p>
            </div>
          </div>

          {/* Preview words */}
          <div className="flex flex-wrap gap-2 mb-3">
            {miniPracticeSet.words.slice(0, 4).map((word, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-background/80 rounded-full text-sm font-medium text-foreground border border-border"
              >
                {word}
              </span>
            ))}
            {miniPracticeSet.words.length > 4 && (
              <span className="px-3 py-1 text-sm text-muted-foreground">
                +{miniPracticeSet.words.length - 4} more
              </span>
            )}
          </div>

          <Button
            size="sm"
            onClick={handleStartFocusedSession}
            className="w-full rounded-pill shadow-button"
          >
            Start 5-Minute Practice
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Secondary sounds */}
        {secondarySounds.length > 0 && (
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">Also practice:</p>
            <div className="flex flex-wrap gap-2">
              {secondarySounds.map((sound, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-secondary/20 border-secondary/30 text-secondary-foreground"
                >
                  {sound.displayName} sound
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
