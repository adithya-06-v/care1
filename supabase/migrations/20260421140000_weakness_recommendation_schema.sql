-- Weakness-based recommendation: ensure schema + RLS (safe if already applied in earlier migrations)

-- 1. profiles.weakness (onboarding / manual preference)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS weakness text;

COMMENT ON COLUMN public.profiles.weakness IS 'Tag key matching exercises.tags (e.g. oral_motor, breath, articulation)';

-- 2. user_weakness — one row per user (upsert on user_id in app)
CREATE TABLE IF NOT EXISTS public.user_weakness (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  weakness text,
  confidence double precision DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT user_weakness_user_id_key UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_weakness_user_id ON public.user_weakness (user_id);

ALTER TABLE public.user_weakness ENABLE ROW LEVEL SECURITY;

-- Consolidate to a single policy (drops granular policies from 20260418000000 if present)
DROP POLICY IF EXISTS "user_weakness_select_own" ON public.user_weakness;
DROP POLICY IF EXISTS "user_weakness_insert_own" ON public.user_weakness;
DROP POLICY IF EXISTS "user_weakness_update_own" ON public.user_weakness;
DROP POLICY IF EXISTS "user_weakness_delete_own" ON public.user_weakness;
DROP POLICY IF EXISTS "Users can manage their weakness" ON public.user_weakness;

CREATE POLICY "Users can manage their weakness"
ON public.user_weakness
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

COMMENT ON TABLE public.user_weakness IS 'Cached AI/rule-based speech weakness tag for personalized exercises';
