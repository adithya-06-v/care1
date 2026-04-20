-- Video call room id (channel name) when therapist accepts a booking
ALTER TABLE public.appointments
ADD COLUMN IF NOT EXISTS room_id text;

COMMENT ON COLUMN public.appointments.room_id IS 'Agora channel id (UUID) for 1:1 video session';
