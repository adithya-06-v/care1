-- Three catalog exercises: iframe-safe embed URLs, thumbnails, tags, and categories
-- that match PersonalizedExercises ilike (breath / articulation / oral substrings).

INSERT INTO public.exercises (title, description, video_url, category, image_url, difficulty, tags)
SELECT
  'Breathing Control',
  'Slow inhale and exhale',
  'https://www.youtube.com/embed/2Vv-BfVoq4g',
  'Breath support',
  'https://images.unsplash.com/photo-1584515933487-779824d29309',
  'Easy',
  ARRAY['breath', 'breathing']::text[]
WHERE NOT EXISTS (SELECT 1 FROM public.exercises WHERE title = 'Breathing Control');

INSERT INTO public.exercises (title, description, video_url, category, image_url, difficulty, tags)
SELECT
  'Lip Rounding',
  'Practice O and E sounds',
  'https://www.youtube.com/embed/ZbZSe6N_BXs',
  'Articulation',
  'https://images.unsplash.com/photo-1550831107-1553da8c8464',
  'Medium',
  ARRAY['articulation', 'pronunciation', 'lips']::text[]
WHERE NOT EXISTS (SELECT 1 FROM public.exercises WHERE title = 'Lip Rounding');

INSERT INTO public.exercises (title, description, video_url, category, image_url, difficulty, tags)
SELECT
  'Tongue Stretch',
  'Move tongue left and right',
  'https://www.youtube.com/embed/ysz5S6PUM-U',
  'Oral motor',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
  'Medium',
  ARRAY['oral_motor', 'tongue']::text[]
WHERE NOT EXISTS (SELECT 1 FROM public.exercises WHERE title = 'Tongue Stretch');
