import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExerciseViewerModal } from '@/components/dashboard/ExerciseViewerModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';
import { readExerciseStreak } from '@/lib/exerciseStreak';
import { DEFAULT_EXERCISE_IMAGE, exerciseCardImageSrc } from '@/lib/exerciseAssets';
import { getEmbedUrl } from '@/lib/youtubeEmbed';
import { ExerciseListenButton } from '@/components/dashboard/ExerciseListenButton';
import { BookOpen, CheckCircle2, Flame, ListChecks, Loader2 } from 'lucide-react';

type ExerciseRow = Database['public']['Tables']['exercises']['Row'];
type ProgressRow = Database['public']['Tables']['exercises_progress']['Row'];

export interface ExercisesDuolingoProps {
  userId: string;
}

function difficultyVariant(d: string | null | undefined): 'default' | 'secondary' | 'destructive' | 'outline' {
  const x = (d ?? '').toLowerCase();
  if (x === 'easy') return 'secondary';
  if (x === 'hard') return 'destructive';
  return 'default';
}

export function ExercisesDuolingo({ userId }: ExercisesDuolingoProps) {
  const [exercises, setExercises] = useState<ExerciseRow[]>([]);
  const [progressRows, setProgressRows] = useState<ProgressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseRow | null>(null);

  const progressByExerciseId = useMemo(
    () => new Map(progressRows.map((r) => [r.exercise_id, r] as const)),
    [progressRows],
  );

  const total = exercises.length;
  const completedCount = useMemo(
    () => progressRows.filter((r) => r.completed).length,
    [progressRows],
  );
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('title', { ascending: true });

      if (error) {
        console.warn('[ExercisesDuolingo] exercises fetch error (table may not exist yet):', error.message);
        setExercises([]);
        return;
      }

      const rows = data ?? [];
      /** Static drills only — video lessons live in Recommended (disjoint sets). */
      const staticOnly = rows.filter((ex) => !getEmbedUrl(ex.video_url));
      console.log('[ExercisesDuolingo] static drills (no embed video):', staticOnly.length, '/', rows.length);
      setExercises(staticOnly);

      const { data: progressData, error: progressError } = await supabase
        .from('exercises_progress')
        .select('*')
        .eq('user_id', userId);

      if (progressError) {
        console.warn('[ExercisesDuolingo] exercises_progress fetch error (table may not exist yet):', progressError.message);
        setProgressRows([]);
      } else {
        console.log('[ExercisesDuolingo] progress data:', progressData);
        setProgressRows(progressData ?? []);
      }

      setStreak(readExerciseStreak(userId));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <section className="mb-10 mt-2" aria-labelledby="section-daily-title">
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-border/80 bg-card py-16 text-muted-foreground shadow-inner transition-colors duration-300">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          Loading exercises…
        </div>
      </section>
    );
  }

  if (exercises.length === 0) {
    return (
      <section className="mb-10 mt-2" aria-labelledby="section-daily-title">
        <Card className="rounded-2xl border-dashed border-emerald-500/25 bg-muted/30 shadow-md transition-shadow duration-300">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            <BookOpen className="mx-auto mb-3 h-10 w-10 opacity-40" />
            <p className="font-medium text-foreground">No static drills in the catalog</p>
            <p className="mt-1 max-w-md mx-auto">
              All current exercises include video — find them under <span className="font-medium text-foreground">Recommended for You</span> below.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section
      className="mb-10 mt-2 rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.07] to-transparent p-6 shadow-sm transition-shadow duration-300 sm:p-8"
      aria-labelledby="section-daily-title"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Badge className="rounded-full border-emerald-500/40 bg-emerald-500/15 font-semibold text-emerald-800 shadow-sm transition-shadow dark:text-emerald-200">
              Practice
            </Badge>
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Static drills
            </span>
          </div>
          <h2
            id="section-daily-title"
            className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 sm:text-3xl"
          >
            <ListChecks className="h-7 w-7 shrink-0 text-emerald-500 transition-transform duration-300 sm:h-8 sm:w-8" />
            Daily Exercises
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Static drills only (no video). Track progress and mark complete. Video lessons live under Recommended — same exercises are not listed here.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-orange-500/30 bg-gradient-to-r from-orange-500/15 to-amber-500/10 px-4 py-2 text-sm font-semibold text-orange-700 shadow-md transition-shadow duration-300 hover:shadow-lg dark:text-orange-300">
            <Flame className="h-5 w-5" aria-hidden />
            <span>{streak} day streak</span>
          </div>
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm">
            {completedCount}/{total} done
          </Badge>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6 overflow-hidden rounded-full border border-emerald-500/20 bg-muted/50 p-1 shadow-inner transition-shadow duration-300">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 shadow-md transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <p className="-mt-3 mb-6 text-right text-xs font-medium text-muted-foreground">{pct}% complete</p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {exercises.map((ex) => {
          const pr = progressByExerciseId.get(ex.id);
          const done = pr?.completed === true;
          return (
            <Card
              key={ex.id}
              className={`group flex h-full flex-col overflow-hidden rounded-2xl border shadow-lg ring-1 ring-black/5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:ring-emerald-400/25 dark:ring-white/10 ${
                done
                  ? 'border-emerald-500/40 bg-gradient-to-br from-emerald-500/5 to-card'
                  : 'border-border/80 bg-card hover:border-emerald-500/35'
              }`}
            >
              <div className="relative overflow-hidden">
                <img
                  src={exerciseCardImageSrc(ex.image_url)}
                  alt=""
                  className="h-36 w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.src.includes('default-exercise.png')) {
                      img.src = DEFAULT_EXERCISE_IMAGE;
                    }
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <Badge
                  variant="secondary"
                  className="absolute left-3 top-3 rounded-lg bg-background/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide shadow-md backdrop-blur-sm"
                >
                  Static drill
                </Badge>
                <Badge
                  variant={difficultyVariant(ex.difficulty)}
                  className="absolute bottom-3 right-3 rounded-lg bg-background/95 font-semibold shadow-md backdrop-blur-sm"
                >
                  {ex.difficulty || 'Easy'}
                </Badge>
              </div>
              <CardContent className="flex flex-1 flex-col gap-3 p-5 pt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="rounded-lg text-xs capitalize">
                    {ex.category}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold leading-snug tracking-tight text-foreground">
                  {ex.title}
                </h3>
                <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {ex.description || 'Practice this drill and mark it complete when you are done.'}
                </p>
                <ExerciseListenButton
                  exercise={ex}
                  disabled={done}
                  className="w-full shrink-0 rounded-full"
                  size="sm"
                />
                <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/60 pt-4">
                  {done ? (
                    <Badge className="rounded-full bg-emerald-600 hover:bg-emerald-600">
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                      Completed
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300">
                      Practice
                    </Badge>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    disabled={done}
                    className={`rounded-full shadow-md transition-all duration-300 ${
                      done
                        ? 'pointer-events-none opacity-80'
                        : 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 hover:shadow-lg'
                    }`}
                    onClick={() => !done && setSelectedExercise(ex)}
                  >
                    {done ? (
                      <>
                        <CheckCircle2 className="mr-1.5 h-4 w-4" />
                        Completed
                      </>
                    ) : (
                      <>
                        <BookOpen className="mr-1.5 h-4 w-4" />
                        Start
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ExerciseViewerModal
        exercise={selectedExercise}
        onClose={() => setSelectedExercise(null)}
        userId={userId}
        onCompleted={() => void load()}
      />
    </section>
  );
}
