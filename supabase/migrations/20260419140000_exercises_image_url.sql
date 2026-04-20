ALTER TABLE public.exercises
ADD COLUMN IF NOT EXISTS image_url text;

COMMENT ON COLUMN public.exercises.image_url IS 'Optional thumbnail URL for exercise cards';
