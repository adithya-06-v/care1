-- Duolingo-style per-exercise progress (scores, completion timestamps)
CREATE TABLE public.exercises_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES public.exercises (id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT false,
  score integer NOT NULL DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, exercise_id)
);

CREATE INDEX IF NOT EXISTS idx_exercises_progress_user_id ON public.exercises_progress (user_id);

ALTER TABLE public.exercises_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "exercises_progress_select_own"
ON public.exercises_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "exercises_progress_insert_own"
ON public.exercises_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "exercises_progress_update_own"
ON public.exercises_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Difficulty for Duolingo-style badges (Easy / Medium / Hard)
ALTER TABLE public.exercises
ADD COLUMN IF NOT EXISTS difficulty text NOT NULL DEFAULT 'Easy';

UPDATE public.exercises
SET difficulty = CASE category
  WHEN 'Breath support' THEN 'Easy'
  WHEN 'Oral motor' THEN 'Medium'
  WHEN 'Articulation' THEN 'Hard'
  ELSE 'Easy'
END;
