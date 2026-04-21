import { useCallback, useEffect, useMemo, useState } from 'react';
import { ExternalLink, Loader2, VideoOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';
import { recordExerciseActiveDay } from '@/lib/exerciseStreak';
import { DEFAULT_EXERCISE_IMAGE, exerciseVideoThumbnailSrc } from '@/lib/exerciseAssets';
import { getEmbedUrl, getYoutubeWatchUrl } from '@/lib/youtubeEmbed';
import { cn } from '@/lib/utils';
import { ExerciseListenButton } from '@/components/dashboard/ExerciseListenButton';

type ExerciseRow = Database['public']['Tables']['exercises']['Row'];

export interface ExerciseViewerModalProps {
  exercise: ExerciseRow | null;
  onClose: () => void;
  userId: string;
  /** Called after successful mark complete so parent can refresh progress */
  onCompleted?: () => void;
}

function difficultyBadgeVariant(d: string | null | undefined): 'default' | 'secondary' | 'destructive' | 'outline' {
  const x = (d ?? '').toLowerCase();
  if (x === 'easy') return 'secondary';
  if (x === 'hard') return 'destructive';
  return 'default';
}

export function ExerciseViewerModal({
  exercise,
  onClose,
  userId,
  onCompleted,
}: ExerciseViewerModalProps) {
  const [resolvedExercise, setResolvedExercise] = useState<ExerciseRow | null>(null);
  const [fetchingExercise, setFetchingExercise] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [iframeFailed, setIframeFailed] = useState(false);

  /** Fresh row from DB when available; falls back to the selected prop while loading. */
  const displayExercise = useMemo(
    () => (exercise ? resolvedExercise ?? exercise : null),
    [exercise, resolvedExercise],
  );

  useEffect(() => {
    if (!exercise) {
      setResolvedExercise(null);
      setFetchingExercise(false);
      return;
    }

    setResolvedExercise(null);
    setFetchingExercise(true);
    let cancelled = false;

    void (async () => {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', exercise.id)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        console.warn('[ExerciseViewerModal] exercise fetch error (table may not exist yet):', error.message);
        setResolvedExercise(exercise);
      } else if (data) {
        setResolvedExercise(data);
      } else {
        setResolvedExercise(exercise);
      }
      setFetchingExercise(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [exercise?.id]);

  const refreshDone = useCallback(async () => {
    const ex = displayExercise;
    if (!ex || !userId) {
      setAlreadyDone(false);
      return;
    }
    const { data } = await supabase
      .from('exercises_progress')
      .select('completed')
      .eq('user_id', userId)
      .eq('exercise_id', ex.id)
      .maybeSingle();
    setAlreadyDone(data?.completed === true);
  }, [displayExercise, userId]);

  useEffect(() => {
    void refreshDone();
  }, [refreshDone]);

  useEffect(() => {
    if (!exercise) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [exercise, onClose]);

  const rawVideoUrl = displayExercise?.video_url;
  /** Always pass through getEmbedUrl — never raw watch/search URLs in iframe src */
  const embedSrc = displayExercise ? getEmbedUrl(rawVideoUrl) : null;
  const watchUrl = getYoutubeWatchUrl(rawVideoUrl);
  const thumbUrl = exerciseVideoThumbnailSrc(rawVideoUrl, displayExercise?.image_url);

  useEffect(() => {
    setIframeFailed(false);
  }, [embedSrc, displayExercise?.id, displayExercise?.video_url]);

  const handleMarkCompleted = async () => {
    const ex = displayExercise;
    if (!ex) return;
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const { error } = await supabase.from('exercises_progress').upsert(
        {
          user_id: userId,
          exercise_id: ex.id,
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

      recordExerciseActiveDay(userId);
      setAlreadyDone(true);
      toast({ title: 'Marked completed' });
      onCompleted?.();
    } finally {
      setSaving(false);
    }
  };

  if (!exercise || !displayExercise) return null;

  const description = displayExercise.description?.trim();
  const hasEmbed = Boolean(embedSrc);
  const showFallback = hasEmbed && iframeFailed;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4',
        'animate-in fade-in-0 duration-300',
      )}
      role="dialog"
      aria-modal
      aria-labelledby="exercise-viewer-title"
      aria-busy={fetchingExercise}
      onClick={onClose}
    >
      <div
        className={cn(
          'flex max-h-[min(90vh,860px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl',
          'animate-in fade-in-0 zoom-in-95 duration-300',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border/80 bg-card px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={difficultyBadgeVariant(displayExercise.difficulty)}
                className="rounded-lg capitalize"
              >
                {displayExercise.difficulty || 'Easy'}
              </Badge>
              {displayExercise.category ? (
                <Badge variant="outline" className="rounded-lg capitalize">
                  {displayExercise.category}
                </Badge>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="exercise-viewer-title"
                className="text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl"
              >
                {displayExercise.title}
              </h2>
              {fetchingExercise ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                  Syncing…
                </span>
              ) : null}
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-full"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="overflow-hidden rounded-xl border border-border/80 bg-black/5 shadow-inner dark:bg-black/20">
            {!hasEmbed ? (
              <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 bg-muted/80 px-6 py-12 text-center">
                <VideoOff className="h-12 w-12 text-muted-foreground/60" aria-hidden />
                <p className="text-base font-medium text-foreground">Video not available</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  This exercise has no embeddable video URL yet.
                </p>
              </div>
            ) : showFallback ? (
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <img
                  src={thumbUrl}
                  alt=""
                  className="h-full w-full object-cover opacity-90"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.src.includes('default-exercise.png')) {
                      img.src = DEFAULT_EXERCISE_IMAGE;
                    }
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/65 p-6 text-center">
                  <VideoOff className="h-10 w-10 text-white/90" aria-hidden />
                  <p className="text-sm font-medium text-white">Video couldn&apos;t load in the app</p>
                  {watchUrl ? (
                    <Button variant="secondary" size="sm" asChild className="gap-2">
                      <a href={watchUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        Open on YouTube
                      </a>
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10"
                    onClick={() => setIframeFailed(false)}
                  >
                    Try again
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  key={`${displayExercise.id}-${embedSrc}`}
                  src={embedSrc!}
                  title={displayExercise.title}
                  className="absolute inset-0 h-full w-full min-h-[240px] border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  loading="lazy"
                  onError={() => setIframeFailed(true)}
                />
              </div>
            )}
          </div>

          {description ? (
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap sm:text-base">
              {description}
            </p>
          ) : (
            <p className="mt-6 text-sm italic text-muted-foreground/80">No description for this exercise.</p>
          )}

          <div className="mt-4">
            <ExerciseListenButton exercise={displayExercise} variant="secondary" size="default" />
          </div>
        </div>

        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border/80 bg-muted/30 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            {hasEmbed && watchUrl ? (
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <a href={watchUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Open video
                </a>
              </Button>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button type="button" variant="outline" className="min-w-[100px]" onClick={onClose}>
              Close
            </Button>
            <Button
              type="button"
              disabled={alreadyDone || saving}
              className="min-w-[160px] bg-emerald-600 hover:bg-emerald-500"
              onClick={() => void handleMarkCompleted()}
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {alreadyDone ? 'Completed' : 'Mark as Completed'}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
