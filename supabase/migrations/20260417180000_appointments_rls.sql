-- Row-level access for appointments (therapist + patient flows)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Patients: own rows (book, read, update status)
DROP POLICY IF EXISTS "appointments_patient_select" ON public.appointments;
CREATE POLICY "appointments_patient_select"
ON public.appointments
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "appointments_patient_insert" ON public.appointments;
CREATE POLICY "appointments_patient_insert"
ON public.appointments
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "appointments_patient_update" ON public.appointments;
CREATE POLICY "appointments_patient_update"
ON public.appointments
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Therapists: rows assigned to them (dashboard, end call, notes)
DROP POLICY IF EXISTS "appointments_therapist_select" ON public.appointments;
CREATE POLICY "appointments_therapist_select"
ON public.appointments
FOR SELECT
TO authenticated
USING (therapist_id = auth.uid());

DROP POLICY IF EXISTS "appointments_therapist_update" ON public.appointments;
CREATE POLICY "appointments_therapist_update"
ON public.appointments
FOR UPDATE
TO authenticated
USING (therapist_id = auth.uid())
WITH CHECK (therapist_id = auth.uid());
