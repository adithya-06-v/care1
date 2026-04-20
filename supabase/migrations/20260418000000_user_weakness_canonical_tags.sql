-- AI-detected weakness persistence (one row per user)
CREATE TABLE IF NOT EXISTS public.user_weakness (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  weakness text,
  confidence double precision,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_weakness_user_id_key UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_weakness_user_id ON public.user_weakness (user_id);

ALTER TABLE public.user_weakness ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_weakness_select_own"
ON public.user_weakness
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "user_weakness_insert_own"
ON public.user_weakness
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_weakness_update_own"
ON public.user_weakness
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_weakness_delete_own"
ON public.user_weakness
FOR DELETE
USING (auth.uid() = user_id);

COMMENT ON TABLE public.user_weakness IS 'Cached AI/rule-based speech weakness tag for personalized exercises';

-- Align catalog tags with canonical keys used by recommendations (pronunciation, tongue, stammering)
UPDATE public.exercises
SET tags = tags || ARRAY['pronunciation']::text[]
WHERE title = 'Lip movement' AND NOT (tags @> ARRAY['pronunciation']::text[]);

UPDATE public.exercises
SET tags = tags || ARRAY['stammering']::text[]
WHERE title = 'Breathing control' AND NOT (tags @> ARRAY['stammering']::text[]);
