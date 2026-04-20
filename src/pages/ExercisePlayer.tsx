import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';
import { recordExerciseActiveDay } from '@/lib/exerciseStreak';
import { getEmbedUrl } from '@/lib/youtubeEmbed';
import TongueExercise3D from '@/components/exercises/TongueExercise3D';

type ExerciseRow = Database['public']['Tables']['exercises']['Row'];

const ExercisePlayer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [exercise, setExercise] = useState<ExerciseRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);

  const load = useCallback(async () => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setNotFound(false);
    try {
      const { data, error } = await supabase.from('exercises').select('*').eq('id', id).single();

      if (error) {
        console.error('[ExercisePlayer] exercises fetch error:', error);
        setNotFound(true);
        setExercise(null);
        return;
      }

      if (!data) {
        console.error('[ExercisePlayer] exercises: no row for id', id);
        setNotFound(true);
        setExercise(null);
        return;
      }

      console.log('[ExercisePlayer] exercise data:', data);
      setExercise(data);
      console.log('[ExercisePlayer] exercise.video_url', data.video_url);

      if (user?.id) {
        const { data: pr } = await supabase
          .from('exercises_progress')
          .select('completed')
          .eq('user_id', user.id)
          .eq('exercise_id', id)
          .maybeSingle();
        setAlreadyDone(pr?.completed === true);
      }
    } finally {
      setLoading(false);
    }
  }, [id, user?.id]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/auth', { replace: true, state: { from: `/exercise/${id}` } });
      return;
    }
    void load();
  }, [authLoading, user, navigate, id, load]);

  const handleMarkCompleted = async () => {
    if (!user?.id || !exercise) return;
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const { error } = await supabase.from('exercises_progress').upsert(
        {
          user_id: user.id,
          exercise_id: exercise.id,
          completed: true,
          score: 100,
          completed_at: now,
        },
        { onConflict: 'user_id,exercise_id' },
      );

      if (error) {
        toast({ title: 'Could not save', description: error.message, variant: 'destructive' });
        return;
      }

      const streak = recordExerciseActiveDay(user.id);
      setAlreadyDone(true);
      toast({
        title: 'Marked completed',
        description:
          streak > 1 ? `${streak}-day streak — keep it going!` : 'Great work — progress saved.',
      });
    } finally {
      setSaving(false);
    }
  };

  const embed = exercise ? getEmbedUrl(exercise.video_url) : null;
  const instructions = exercise?.description?.trim();
  const tags = exercise.tags ?? [];
  const isTongueExercise = tags.includes('tongue');

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-400" aria-hidden />
      </div>
    );
  }

  if (notFound || !exercise) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-4 text-center text-zinc-100">
        <p className="text-lg font-medium">Exercise not found</p>
        <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>
          Back to dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8 md:py-12">
        <Button
          type="button"
          variant="ghost"
          className="w-fit gap-2 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Button>

        <header className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">{exercise.title}</h1>
          <p className="mt-2 text-sm text-zinc-400 capitalize">{exercise.category}</p>
        </header>

        <div className="space-y-4 overflow-hidden rounded-xl border border-zinc-800 bg-black shadow-2xl ring-1 ring-white/5">
          {isTongueExercise ? (
            <>
              <div className="overflow-hidden rounded-t-xl">
                <TongueExercise3D />
              </div>
              <p className="px-4 pb-1 text-center text-xs text-zinc-500">
                Drag to rotate — practice the motion alongside your session
              </p>
            </>
          ) : null}
          {embed ? (
            <iframe
              width="100%"
              height={isTongueExercise ? 280 : 350}
              title={exercise.title}
              src={embed}
              className={`w-full border-0 ${isTongueExercise ? 'h-[280px]' : 'h-[350px]'}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : !isTongueExercise ? (
            <div className="flex h-[350px] items-center justify-center bg-zinc-900 p-8 text-center text-zinc-400">
              Video not available
            </div>
          ) : null}
        </div>

        {instructions ? (
          <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-left">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
              Instructions
            </h2>
            <p className="whitespace-pre-wrap text-base leading-relaxed text-zinc-200">{instructions}</p>
          </section>
        ) : null}

        <div className="flex flex-col items-center gap-3 pb-8">
          <Button
            type="button"
            size="lg"
            disabled={alreadyDone || saving}
            className="min-w-[200px] rounded-full bg-emerald-600 px-8 text-base font-semibold hover:bg-emerald-500 disabled:opacity-70"
            onClick={() => void handleMarkCompleted()}
          >
            {saving ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : alreadyDone ? (
              'Completed'
            ) : (
              'Mark Completed'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExercisePlayer;
