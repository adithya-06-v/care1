-- Optional contact field for therapist dashboard (can be synced from auth later)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email text;

COMMENT ON COLUMN public.profiles.email IS 'Optional display email; may mirror auth.users.email';

-- Therapists can read patient profiles when they share an accepted or completed appointment
CREATE POLICY "Therapists can view profiles via appointments"
ON public.profiles
FOR SELECT
USING (
  public.has_role(auth.uid(), 'therapist')
  AND EXISTS (
    SELECT 1
    FROM public.appointments a
    WHERE a.therapist_id = auth.uid()
      AND a.user_id = profiles.user_id
      AND a.status IN ('accepted', 'completed')
  )
);

CREATE POLICY "Therapists can view sessions via appointments"
ON public.sessions
FOR SELECT
USING (
  public.has_role(auth.uid(), 'therapist')
  AND EXISTS (
    SELECT 1
    FROM public.appointments a
    WHERE a.therapist_id = auth.uid()
      AND a.user_id = sessions.user_id
      AND a.status IN ('accepted', 'completed')
  )
);

CREATE POLICY "Therapists can view exercise_results via appointments"
ON public.exercise_results
FOR SELECT
USING (
  public.has_role(auth.uid(), 'therapist')
  AND EXISTS (
    SELECT 1
    FROM public.appointments a
    WHERE a.therapist_id = auth.uid()
      AND a.user_id = exercise_results.user_id
      AND a.status IN ('accepted', 'completed')
  )
);
