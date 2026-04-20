-- Broadcast appointment row updates to Supabase Realtime (e.g. video call end)
-- Skip if your project already added this table to the publication.
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
