import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface WeakWord {
  exercise_text: string;
  avgScore: number;
  attempts: number;
}

interface MispronounedWordsProps {
  userId: string;
}

export const MispronounedWords = ({ userId }: MispronounedWordsProps) => {
  const navigate = useNavigate();
  const [weakWords, setWeakWords] = useState<WeakWord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeakWords = async () => {
      setIsLoading(true);
      // Get all exercise results with low scores (< 70)
      const { data, error } = await supabase
        .from('exercise_results')
        .select('exercise_text, score')
        .eq('user_id', userId)
        .lt('score', 70)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching weak words:', error);
        setIsLoading(false);
        return;
      }

      // Group by exercise_text and count mispronunciations
      const wordMap = new Map<string, { total: number; count: number }>();
      
      data?.forEach(result => {
        const text = result.exercise_text.trim();
        const existing = wordMap.get(text) || { total: 0, count: 0 };
        wordMap.set(text, {
          total: existing.total + (Number(result.score) || 0),
          count: existing.count + 1,
        });
      });

      // Convert to array and sort by frequency (most mispronounced first)
      const words: WeakWord[] = [];
      wordMap.forEach((value, key) => {
        words.push({
          exercise_text: key,
          avgScore: Math.round(value.total / value.count),
          attempts: value.count,
        });
      });

      // Sort by mispronunciation count (highest first)
      words.sort((a, b) => b.attempts - a.attempts);
      
      // Top 5 most mispronounced
      setWeakWords(words.slice(0, 5));
      setIsLoading(false);
    };

    if (userId) {
      fetchWeakWords();
    }

    // Subscribe to realtime updates for automatic refresh
    const channel = supabase
      .channel('exercise_results_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'exercise_results',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          // Refetch when new results are added
          fetchWeakWords();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handlePracticeWeakWords = () => {
    const wordsToRetry = weakWords.map(w => w.exercise_text);
    sessionStorage.setItem('retryExercises', JSON.stringify(wordsToRetry));
    navigate('/therapy-session?duration=5&mode=retry');
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border shadow-card">
        <CardContent className="p-6 flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (weakWords.length === 0) {
    return (
      <Card className="bg-card border-border shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-foreground text-base">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            Words to Practice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">Great job! No weak words detected.</p>
            <p className="text-xs mt-1">Keep practicing to maintain your skills!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-foreground text-base">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          Most Mispronounced Words
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {weakWords.map((word, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg border border-orange-500/20"
            >
              <span className="text-sm text-foreground font-medium">
                {word.exercise_text}
              </span>
              <span className="text-sm text-orange-600 font-medium">
                {word.attempts} {word.attempts === 1 ? 'time' : 'times'}
              </span>
            </div>
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handlePracticeWeakWords}
          className="w-full mt-2 border-orange-500/50 text-orange-600 hover:bg-orange-500/10"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Practice These Words
        </Button>
      </CardContent>
    </Card>
  );
};
