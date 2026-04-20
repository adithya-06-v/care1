-- Session notes (therapist) and call duration in seconds (set when call completes)
ALTER TABLE public.appointments
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS duration integer;

COMMENT ON COLUMN public.appointments.notes IS 'Therapist session notes after video call';
COMMENT ON COLUMN public.appointments.duration IS 'Video call length in seconds when status is completed';
