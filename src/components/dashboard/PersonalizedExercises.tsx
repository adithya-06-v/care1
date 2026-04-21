import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExerciseViewerModal } from '@/components/dashboard/ExerciseViewerModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';
import type { TherapyMode } from '@/lib/therapyModes';
import {
  buildProgressDataFromSessions,
  detectWeakness,
  type WeaknessProgressData,
} from '@/lib/detectWeakness';
import { profileWeaknessToTag, weaknessTagToCategoryPattern } from '@/lib/weaknessCategory';
import { DEFAULT_EXERCISE_IMAGE, exerciseVideoThumbnailSrc } from '@/lib/exerciseAssets';
import { getEmbedUrl } from '@/lib/youtubeEmbed';
import { ExerciseListenButton } from '@/components/dashboard/ExerciseListenButton';
import { CheckCircle2, ChevronDown, Loader2, Sparkles, Video } from 'lucide-react';

type ExerciseRow = Database['public']['Tables']['exercises']['Row'];
type ProgressRow = Database['public']['Tables']['exercises_progress']['Row'];

/** UI label → canonical tag stored in exercises.tags */
export const focusToTagMap = {
  Articulation: 'pronunciation',
  Pronunciation: 'pronunciation',
  'Oral motor': 'tongue',
  'Breath control': 'stammering',
  'Breathing support': 'stammering',
  Tongue: 'tongue',
  Lips: 'pronunciation',
} as const;

export type FocusLabel = keyof typeof focusToTagMap;

const FOCUS_LABELS = Object.keys(focusToTagMap) as FocusLabel[];

function weaknessPhrase(tag: string | null | undefined): string {
  const t = (tag || '').toLowerCase();
  switch (t) {
    case 'stammering':
      return 'breath / stammering';
    case 'pronunciation':
      return 'pronunciation';
    case 'tongue':
      return 'tongue';
    default:
      return tag || 'general';
  }
}

export interface PersonalizedExercisesProps {
  userId: string;
  /** When set (e.g. from Dashboard session stats), avoids an extra sessions query */
  averageAccuracy?: number;
  therapyMode?: TherapyMode | null;
}

function difficultyBadgeVariant(d: string | null | undefined): 'default' | 'secondary' | 'destructive' | 'outline' {
  const x = (d || '').toLowerCase();
  if (x === 'easy') return 'secondary';
  if (x === 'hard') return 'destructive';
  return 'default';
}

function hasVideoExercise(ex: ExerciseRow): boolean {
  return !!getEmbedUrl(ex.video_url);
}

/**
 * Client filter: category includes the substring for the active weakness tag
 * (same needles as server ilike — e.g. tongue → oral, pronunciation → articulation).
 */
function filterExercisesByFocus(
  exercises: ExerciseRow[],
  weaknessTag: string | null | undefined,
): ExerciseRow[] {
  if (weaknessTag == null || String(weaknessTag).trim() === '') {
    return exercises;
  }
  const focus = weaknessTagToCategoryPattern(weaknessTag);
  const focusLower = (focus || '').toLowerCase();
  if (!focusLower) {
    return exercises;
  }
  return exercises.filter((e) =>
    (e.category || '').toLowerCase().includes(focusLower),
  );
}

/** Tag match for personalization (case-insensitive). */
function exerciseMatchesWeaknessTag(ex: ExerciseRow, weaknessKey: string): boolean {
  const w = (weaknessKey || 'pronunciation').toLowerCase();
  const tags = ex.tags || [];
  return tags.some((t) => (t || '').toLowerCase() === w);
}

export function PersonalizedExercises({
  userId,
  averageAccuracy: averageAccuracyProp,
  therapyMode: therapyModeProp,
}: PersonalizedExercisesProps) {
  const averageAccuracyRef = useRef(averageAccuracyProp);
  const therapyModeRef = useRef(therapyModeProp);
  averageAccuracyRef.current = averageAccuracyProp;
  therapyModeRef.current = therapyModeProp;

  /** All catalog rows with an embeddable video (for manual focus filtering). */
  const [fullVideoCatalog, setFullVideoCatalog] = useState<ExerciseRow[]>([]);
  /** Video exercises matching user_weakness category filter (or full catalog fallback). */
  const [weaknessRecommendedList, setWeaknessRecommendedList] = useState<ExerciseRow[]>([]);
  /** True when we show first-3 fallback (no tag match). */
  const [showingTrendingFallback, setShowingTrendingFallback] = useState(false);
  const [aiWeakness, setAiWeakness] = useState<string>('pronunciation');
  /** Resolved from user_weakness → profile → "pronunciation" (never empty). */
  const [storedWeakness, setStoredWeakness] = useState<string>('pronunciation');
  const [confidence, setConfidence] = useState<number | null>(null);
  const [progressRows, setProgressRows] = useState<ProgressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [manualLabel, setManualLabel] = useState<FocusLabel | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseRow | null>(null);

  /** Manual focus overrides; else canonical tag from resolved weakness / AI. */
  const activeWeaknessKey = useMemo(() => {
    if (manualLabel) return focusToTagMap[manualLabel];
    return (
      profileWeaknessToTag(storedWeakness) ?? storedWeakness ?? aiWeakness ?? 'pronunciation'
    );
  }, [manualLabel, storedWeakness, aiWeakness]);

  const manualFiltered = useMemo(
    () => filterExercisesByFocus(fullVideoCatalog, activeWeaknessKey),
    [fullVideoCatalog, activeWeaknessKey],
  );

  /** Manual focus: filtered rows; else weakness-based list from load(). */
  const displayedExercises = useMemo(() => {
    if (manualLabel) {
      return manualFiltered.length > 0 ? manualFiltered : fullVideoCatalog;
    }
    return weaknessRecommendedList;
  }, [manualLabel, manualFiltered, fullVideoCatalog, weaknessRecommendedList]);

  const progressByExerciseId = useMemo(
    () => new Map(progressRows.map((r) => [r.exercise_id, r] as const)),
    [progressRows],
  );

  const load = useCallback(async () => {
    const averageAccuracyProp = averageAccuracyRef.current;
    const therapyModeProp = therapyModeRef.current;

    setLoading(true);
    try {
      let { data: profileRow, error: profileErr } = await supabase
        .from('profiles')
        .select('therapy_mode, weakness')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileErr) {
        console.error('PROFILE FETCH ERROR:', profileErr.message);
        const msg = profileErr.message ?? '';
        if (
          /weakness|does not exist|schema cache|column/i.test(msg) &&
          !/permission|rls|policy/i.test(msg)
        ) {
          const retry = await supabase
            .from('profiles')
            .select('therapy_mode')
            .eq('user_id', userId)
            .maybeSingle();
          if (!retry.error) {
            profileRow = retry.data
              ? { ...retry.data, weakness: null as string | null }
              : null;
            profileErr = null;
          }
        }
      }

      const therapyMode: TherapyMode | null =
        therapyModeProp !== undefined
          ? therapyModeProp ?? null
          : ((profileRow?.therapy_mode as TherapyMode | null) ?? null);

      let merged: WeaknessProgressData;

      if (averageAccuracyProp !== undefined) {
        const base = buildProgressDataFromSessions([], therapyMode);
        const clamp = (n: number) => Math.min(100, Math.max(0, Math.round(n)));
        merged = {
          ...base,
          pronunciation_score: clamp(averageAccuracyProp),
          fluency_score:
            therapyMode === 'fluency' ? clamp(averageAccuracyProp) : base.fluency_score,
        };
      } else {
        const { data: sessionsData, error: sErr } = await supabase
          .from('sessions')
          .select('accuracy_score, exercises_completed')
          .eq('user_id', userId);
        if (sErr) {
          console.error('SESSIONS FETCH ERROR:', sErr.message);
        }
        merged = buildProgressDataFromSessions(sessionsData ?? [], therapyMode);
      }

      const ai = detectWeakness(merged);
      const detectedWeakness = (ai || 'pronunciation').trim() || 'pronunciation';
      const conf = Math.min(0.95, 0.45 + (merged.pronunciation_score / 200));

      // Auto create/update — no manual DB setup; new users get a row immediately.
      const { error: uwErr } = await supabase.from('user_weakness').upsert(
        {
          user_id: userId,
          weakness: detectedWeakness,
          confidence: conf ?? 0.5,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      );

      if (uwErr) {
        console.error('USER_WEAKNESS UPSERT ERROR:', uwErr.message);
      }

      const { data: weaknessData, error: wFetchErr } = await supabase
        .from('user_weakness')
        .select('weakness, confidence')
        .eq('user_id', userId)
        .maybeSingle();

      if (wFetchErr) {
        console.warn('USER_WEAKNESS FETCH:', wFetchErr.message);
      }

      const weakness =
        (!wFetchErr && weaknessData?.weakness?.trim()
          ? weaknessData.weakness.trim()
          : null) ||
        profileRow?.weakness?.trim() ||
        'pronunciation';

      setAiWeakness(detectedWeakness);
      setStoredWeakness(weakness);
      setConfidence(
        typeof weaknessData?.confidence === 'number' ? weaknessData.confidence : conf,
      );

      const { data: exerciseRows, error: allErr } = await supabase
        .from('exercises')
        .select('*')
        .order('title', { ascending: true });

      if (allErr) {
        console.warn('[PersonalizedExercises] exercises fetch error (table may not exist yet):', allErr.message);
        setFullVideoCatalog([]);
        setWeaknessRecommendedList([]);
        return;
      }

      const exercises = exerciseRows ?? [];
      const fullVideo = exercises.filter(hasVideoExercise);

      const recommended = fullVideo.filter((e) => exerciseMatchesWeaknessTag(e, weakness));
      const usedTagMatch = recommended.length > 0;
      const finalExercises =
        recommended.length > 0 ? recommended : fullVideo.slice(0, 3);

      setFullVideoCatalog(fullVideo);
      setWeaknessRecommendedList(finalExercises);
      setShowingTrendingFallback(!usedTagMatch && fullVideo.length > 0);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    void load();
  }, [userId, averageAccuracyProp, therapyModeProp, load]);

  const exerciseIdsKey = useMemo(
    () => displayedExercises.map((e) => e.id).sort().join(','),
    [displayedExercises],
  );

  useEffect(() => {
    if (!userId || displayedExercises.length === 0) {
      setProgressRows([]);
      return;
    }
    const ids = displayedExercises.map((e) => e.id);
    let cancelled = false;

    void (async () => {
      const { data: prData, error: prErr } = await supabase
        .from('exercises_progress')
        .select('*')
        .eq('user_id', userId)
        .in('exercise_id', ids);

      if (cancelled) return;
      if (prErr) {
        console.error('PROGRESS FETCH ERROR:', prErr.message);
        setProgressRows([]);
        return;
      }
      setProgressRows(prData ?? []);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, exerciseIdsKey]);

  const displayWeakness = activeWeaknessKey || 'pronunciation';
  const isShowingFallback = manualLabel
    ? manualFiltered.length === 0 && fullVideoCatalog.length > 0
    : showingTrendingFallback && fullVideoCatalog.length > 0;

  return (
    <section
      className="mb-10 mt-4 rounded-3xl border border-violet-500/20 bg-gradient-to-b from-violet-500/[0.08] to-transparent p-6 shadow-sm transition-shadow duration-300 sm:p-8"
      aria-labelledby="section-recommended-title"
    >
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge className="rounded-full border-violet-500/40 bg-violet-500/15 font-semibold text-violet-900 shadow-sm transition-shadow dark:text-violet-100">
              Based on your weakness
            </Badge>
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Video only · weakness filter
            </span>
          </div>
          <h2
            id="section-recommended-title"
            className="text-2xl font-bold tracking-tight text-foreground flex flex-wrap items-center gap-2 sm:text-3xl"
          >
            <Sparkles className="h-8 w-8 shrink-0 text-violet-500 transition-transform duration-300 sm:h-9 sm:w-9" />
            <span>
              Recommended for You (Based on: {weaknessPhrase(displayWeakness)})
            </span>
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              Personalized by weakness · Targeting: {weaknessPhrase(displayWeakness)}
            </span>
            {manualLabel ? (
              <span className="text-muted-foreground"> · Focus: {manualLabel}</span>
            ) : null}
            {confidence != null && (
              <span className="text-muted-foreground">
                {' '}
                · confidence {Math.round(confidence * 100)}%
              </span>
            )}
          </p>
          {isShowingFallback ? (
            <p className="mt-2 text-xs text-amber-700/90 dark:text-amber-400/90">
              {manualLabel
                ? `No videos match this focus — showing all video exercises.`
                : `No exercises matched this weakness tag — showing a sample of popular videos (first in catalog).`}
            </p>
          ) : null}
        </div>

        <Collapsible className="w-full sm:max-w-[20rem]">
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex w-full items-center justify-between rounded-2xl border-border/80 bg-background/80 shadow-sm transition-all duration-300 hover:border-violet-500/30 hover:shadow-md"
              type="button"
            >
              <span>Choose focus</span>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-60 transition-transform duration-300" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Filter by category (updates instantly)
              </span>
              <Select
                value={manualLabel ?? 'auto'}
                onValueChange={(v) =>
                  setManualLabel(v === 'auto' ? null : (v as FocusLabel))
                }
              >
                <SelectTrigger className="rounded-2xl border-border/80 shadow-sm transition-shadow duration-300 hover:shadow-md">
                  <SelectValue placeholder="Use AI recommendation" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="auto">Use AI recommendation</SelectItem>
                  {FOCUS_LABELS.map((label) => (
                    <SelectItem key={label} value={label}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-border/80 bg-card/80 py-16 text-muted-foreground shadow-inner transition-colors duration-300">
          <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
          Loading…
        </div>
      ) : displayedExercises.length === 0 ? (
        <Card className="rounded-2xl border-dashed border-border bg-muted/20 shadow-md transition-shadow duration-300">
          <CardContent className="flex flex-col items-center gap-2 py-14 text-center">
            <Video className="h-10 w-10 text-muted-foreground/50" />
            <p className="font-medium text-foreground">No exercises available</p>
            <p className="max-w-md text-sm text-muted-foreground">
              There are no video exercises in the catalog yet. Check back soon.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {displayedExercises.map((ex) => {
            const pr = progressByExerciseId.get(ex.id);
            const done = pr?.completed === true;
            const thumb = exerciseVideoThumbnailSrc(ex.video_url, ex.image_url);

            return (
              <Card
                key={ex.id}
                id={`recommended-ex-${ex.id}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-violet-500/20 bg-card shadow-xl ring-1 ring-violet-500/10 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:ring-violet-400/30 dark:ring-white/10"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-violet-950/40 to-black">
                  <img
                    src={thumb}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (!img.src.includes('default-exercise.png')) {
                        img.src = DEFAULT_EXERCISE_IMAGE;
                      }
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-300" />
                  <Badge
                    variant={difficultyBadgeVariant(ex.difficulty)}
                    className="absolute right-3 top-3 rounded-full border-white/25 bg-black/55 font-semibold text-white shadow-lg backdrop-blur-md"
                  >
                    {ex.difficulty || 'Easy'}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="absolute bottom-3 left-3 gap-1.5 rounded-full border-white/20 bg-black/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-md backdrop-blur-sm"
                  >
                    <Video className="h-3.5 w-3.5" aria-hidden />
                    Video
                  </Badge>
                </div>
                <CardHeader className="space-y-3 px-6 pb-2 pt-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="rounded-lg capitalize transition-colors">
                      {ex.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl leading-snug tracking-tight sm:text-2xl">
                    {ex.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-6 pb-6 pt-0">
                  <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {ex.description || 'Open to watch the guided video and practice along.'}
                  </p>
                  <ExerciseListenButton
                    exercise={ex}
                    disabled={done}
                    className="w-full rounded-full"
                    size="default"
                  />
                  <Button
                    type="button"
                    size="lg"
                    className="w-full rounded-full text-base shadow-md transition-all duration-300 hover:shadow-lg"
                    variant={done ? 'outline' : 'default'}
                    disabled={done}
                    onClick={() => !done && setSelectedExercise(ex)}
                  >
                    {done ? (
                      <>
                        <CheckCircle2 className="mr-2 h-5 w-5 text-emerald-600" />
                        Completed
                      </>
                    ) : (
                      'View Exercise'
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <ExerciseViewerModal
        exercise={selectedExercise}
        onClose={() => setSelectedExercise(null)}
        userId={userId}
        onCompleted={() => void load()}
      />
    </section>
  );
}
