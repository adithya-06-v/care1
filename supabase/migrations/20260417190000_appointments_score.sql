-- Session quality score for therapist progress charts (e.g. 0–100 after video session)
ALTER TABLE public.appointments
ADD COLUMN IF NOT EXISTS score integer;

COMMENT ON COLUMN public.appointments.score IS 'Therapy session score (e.g. 0–100); set when video call completes';
