-- Exercise catalog is public reference data; allow reads for anon + authenticated clients.
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "exercises_select_authenticated" ON public.exercises;
DROP POLICY IF EXISTS "Allow public read" ON public.exercises;

CREATE POLICY "Allow public read"
ON public.exercises
FOR SELECT
TO anon, authenticated
USING (true);
