-- Add emotion_tag column to exercise_results table
ALTER TABLE public.exercise_results 
ADD COLUMN emotion_tag TEXT DEFAULT 'neutral';

-- Add comment for clarity
COMMENT ON COLUMN public.exercise_results.emotion_tag IS 'Detected emotional state during exercise: confident, hesitant, nervous, or neutral';