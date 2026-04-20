-- User focus area for personalized exercise recommendations
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS weakness text;

COMMENT ON COLUMN public.profiles.weakness IS 'Tag key matching exercises.tags (e.g. oral_motor, breath, articulation)';

-- Filter catalog by weakness (array contains)
ALTER TABLE public.exercises
ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_exercises_tags ON public.exercises USING GIN (tags);

-- Tag + embeddable video URLs for personalized section (public embed format)
UPDATE public.exercises
SET
  tags = CASE title
    WHEN 'Tongue stretch' THEN ARRAY['oral_motor', 'tongue']::text[]
    WHEN 'Lip movement' THEN ARRAY['oral_motor', 'lips']::text[]
    WHEN 'Breathing control' THEN ARRAY['breath', 'breathing']::text[]
    WHEN 'Pronunciation drill' THEN ARRAY['articulation', 'pronunciation']::text[]
    ELSE ARRAY[]::text[]
  END,
  video_url = CASE title
    WHEN 'Tongue stretch' THEN 'https://www.youtube.com/embed/ScMzIvxBSi4'
    WHEN 'Lip movement' THEN 'https://www.youtube.com/embed/ScMzIvxBSi4'
    WHEN 'Breathing control' THEN 'https://www.youtube.com/embed/ScMzIvxBSi4'
    WHEN 'Pronunciation drill' THEN 'https://www.youtube.com/embed/ScMzIvxBSi4'
    ELSE video_url
  END
WHERE title IN (
  'Tongue stretch',
  'Lip movement',
  'Breathing control',
  'Pronunciation drill'
);
