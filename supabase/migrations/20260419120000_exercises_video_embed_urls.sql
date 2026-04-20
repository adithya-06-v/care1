-- Ensure catalog exercises use iframe-safe embed URLs (not /results, watch-only, etc.).
-- M7lc1UVf-VE is a widely embeddable YouTube sample used in API docs.
UPDATE public.exercises
SET video_url = 'https://www.youtube.com/embed/M7lc1UVf-VE';
