import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [allWeakWords, setAllWeakWords] = useState<WeakWord[]>([]);

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
      
      setAllWeakWords(words);
      // Top 5 for dashboard preview
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

  const handlePracticeSingleWord = (word: string) => {
    sessionStorage.setItem('retryExercises', JSON.stringify([word]));
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
    <>
      <Card className="bg-card border-border shadow-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-foreground text-base">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Most Mispronounced Words
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-orange-600 hover:bg-orange-500/10"
              onClick={() => setIsViewAllOpen(true)}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {weakWords.map((word, index) => (
              <div
                key={index}
                onClick={() => handlePracticeSingleWord(word.exercise_text)}
                className="group flex items-center justify-between p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10 hover:bg-orange-500/10 transition-all cursor-pointer"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <span className="text-sm md:text-base text-foreground font-semibold block truncate">
                    {word.exercise_text}
                  </span>
                  <span className="text-[10px] md:text-xs text-orange-600 font-black uppercase tracking-widest mt-1 block">
                    {word.attempts} {word.attempts === 1 ? 'attempt' : 'attempts'}
                  </span>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                    <ChevronRight className="w-5 h-5 text-orange-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handlePracticeWeakWords}
            className="w-full mt-2 border-orange-500/50 text-orange-600 hover:bg-orange-500/10 h-10 rounded-xl font-bold"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Practice Top Words
          </Button>
        </CardContent>
      </Card>

      {/* View All Dialog */}
      <Dialog open={isViewAllOpen} onOpenChange={setIsViewAllOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card border-border p-0 overflow-hidden">
          <DialogHeader className="p-6 bg-orange-500/5 border-b border-orange-500/10">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <AlertCircle className="w-6 h-6 text-orange-500" />
              All Weak Words
            </DialogTitle>
            <DialogDescription>
              Complete history of words and sentences that need more practice.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {allWeakWords.map((word, index) => (
              <div
                key={index}
                onClick={() => handlePracticeSingleWord(word.exercise_text)}
                className="group flex items-center justify-between p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10 hover:bg-orange-500/10 transition-all cursor-pointer"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <span className="text-sm md:text-base text-foreground font-semibold block">
                    {word.exercise_text}
                  </span>
                  <span className="text-[10px] md:text-xs text-orange-600 font-black uppercase tracking-widest mt-1 block">
                    {word.attempts} {word.attempts === 1 ? 'attempt' : 'attempts'}
                  </span>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                    <ChevronRight className="w-5 h-5 text-orange-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 mt-auto border-t border-border">
            <Button 
              className="w-full h-12 rounded-xl font-bold bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handlePracticeWeakWords}
            >
              Practice All Weak Words
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
