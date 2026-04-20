-- Catalog of speech therapy exercises (user dashboard)
CREATE TABLE public.exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  video_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Per-user completion tracking
CREATE TABLE public.user_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES public.exercises (id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT false,
  date_completed timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, exercise_id)
);

CREATE INDEX IF NOT EXISTS idx_user_exercises_user_id ON public.user_exercises (user_id);
CREATE INDEX IF NOT EXISTS idx_user_exercises_exercise_id ON public.user_exercises (exercise_id);

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_exercises ENABLE ROW LEVEL SECURITY;

-- Anyone signed in can read the exercise catalog
CREATE POLICY "exercises_select_authenticated"
ON public.exercises
FOR SELECT
TO authenticated
USING (true);

-- Users manage only their own completion rows
CREATE POLICY "user_exercises_select_own"
ON public.user_exercises
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "user_exercises_insert_own"
ON public.user_exercises
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_exercises_update_own"
ON public.user_exercises
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Seed exercises
INSERT INTO public.exercises (title, description, category, video_url) VALUES
(
  'Tongue stretch',
  'Gently extend and relax the tongue to improve mobility and reduce tension before speech tasks.',
  'Oral motor',
  'https://www.youtube.com/results?search_query=tongue+stretch+speech+therapy+exercise'
),
(
  'Lip movement',
  'Practice puckering, smiling, and lip presses to strengthen articulation and coordination.',
  'Oral motor',
  'https://www.youtube.com/results?search_query=lip+movement+speech+therapy'
),
(
  'Breathing control',
  'Use steady diaphragmatic breathing to support longer phrases and calmer, clearer speech.',
  'Breath support',
  'https://www.youtube.com/results?search_query=diaphragmatic+breathing+speech+therapy'
),
(
  'Pronunciation drill',
  'Repeat target sounds and minimal pairs with clear articulation at a steady pace.',
  'Articulation',
  'https://www.youtube.com/results?search_query=pronunciation+drill+speech+therapy'
);
