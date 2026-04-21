import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';
import { DEFAULT_EXERCISE_IMAGE, exerciseCardImageSrc } from '@/lib/exerciseAssets';
import { CheckCircle2, Loader2, Play, Sparkles } from 'lucide-react';

type ExerciseRow = Database['public']['Tables']['exercises']['Row'];
type UserExerciseRow = Database['public']['Tables']['user_exercises']['Row'];

interface SpeechTherapyExercisesSectionProps {
  userId: string;
}

export function SpeechTherapyExercisesSection({ userId }: SpeechTherapyExercisesSectionProps) {
  const [exercises, setExercises] = useState<ExerciseRow[]>([]);
  const [userRows, setUserRows] = useState<UserExerciseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('title', { ascending: true });

      if (error) {
        console.warn('[SpeechTherapyExercisesSection] exercises fetch error (table may not exist yet):', error.message);
        setExercises([]);
        return;
      }

      console.log('[SpeechTherapyExercisesSection] exercises data:', data);
      setExercises(data ?? []);

      const { data: ueData, error: ueError } = await supabase
        .from('user_exercises')
        .select('*')
        .eq('user_id', userId);

      if (ueError) {
        console.warn('[SpeechTherapyExercisesSection] user_exercises fetch error (table may not exist yet):', ueError.message);
        setUserRows([]);
      } else {
        console.log('[SpeechTherapyExercisesSection] user_exercises data:', ueData);
        setUserRows(ueData ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  const completionByExerciseId = new Map(
    userRows.map((r) => [r.exercise_id, r] as const),
  );

  const completedCount = userRows.filter((r) => r.completed).length;
  const totalCount = exercises.length;

  const handleComplete = async (ex: ExerciseRow) => {
    setCompletingId(ex.id);
    try {
      const { error } = await supabase.from('user_exercises').upsert(
        {
          user_id: userId,
          exercise_id: ex.id,
          completed: true,
          date_completed: new Date().toISOString(),
        },
        { onConflict: 'user_id,exercise_id' },
      );

      if (error) {
        console.error(error);
        toast({
          title: 'Could not save',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({ title: 'Nice work!', description: `"${ex.title}" marked complete.` });
      await load();
    } finally {
      setCompletingId(null);
    }
  };

  const openVideo = (ex: ExerciseRow) => {
    const url = ex.video_url?.trim();
    if (!url) {
      toast({
        title: 'Video unavailable',
        description: 'Ask your therapist for a demo link.',
      });
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="mb-8">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Speech therapy exercises
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Short drills you can do between sessions. Track what you have finished.
          </p>
        </div>
        {!loading && totalCount > 0 && (
          <Badge variant="secondary" className="w-fit text-sm font-medium">
            Progress: {completedCount} / {totalCount} completed
          </Badge>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading exercises…
        </div>
      ) : exercises.length === 0 ? (
        <Card className="border-dashed border-border bg-muted/20">
          <CardContent className="py-10 text-center text-muted-foreground text-sm">
            No exercises available
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {exercises.map((ex) => {
            const row = completionByExerciseId.get(ex.id);
            const done = row?.completed === true;
            const busy = completingId === ex.id;

            return (
              <Card
                key={ex.id}
                className={`overflow-hidden rounded-xl border border-border shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
                  done ? 'ring-1 ring-primary/30 bg-primary/5' : 'bg-card'
                }`}
              >
                <img
                  src={exerciseCardImageSrc(ex.image_url)}
                  alt=""
                  className="h-32 w-full object-cover rounded-t-xl"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.src.includes('default-exercise.png')) {
                      img.src = DEFAULT_EXERCISE_IMAGE;
                    }
                  }}
                />
                <CardHeader className="space-y-2 px-5 pb-2 pt-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <CardTitle className="text-lg leading-snug">{ex.title}</CardTitle>
                    <Badge variant="outline" className="capitalize shrink-0">
                      {ex.category}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    {ex.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2 px-5 pb-5 pt-0">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="rounded-full shadow-sm"
                    onClick={() => openVideo(ex)}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Video
                  </Button>
                  {done ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled
                      className="rounded-full border-green-500/50 text-green-700 dark:text-green-400"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Completed
                      {row?.date_completed && (
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                          {new Date(row.date_completed).toLocaleDateString()}
                        </span>
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      className="rounded-full shadow-md"
                      disabled={busy}
                      onClick={() => void handleComplete(ex)}
                    >
                      {busy ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                      )}
                      Mark complete
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
