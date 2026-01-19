-- Add therapy_mode column to profiles table
ALTER TABLE public.profiles
ADD COLUMN therapy_mode text DEFAULT 'pronunciation';

-- Add comment explaining the field
COMMENT ON COLUMN public.profiles.therapy_mode IS 'User selected therapy mode: pronunciation, fluency, child_development, accent';