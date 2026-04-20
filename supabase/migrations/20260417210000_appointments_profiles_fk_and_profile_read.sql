-- Ensure every auth user has a profile row (for therapist joins)
INSERT INTO public.profiles (user_id, full_name, email)
SELECT
  u.id,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    NULLIF(trim(split_part(COALESCE(u.email, ''), '@', 1)), ''),
    'User'
  ),
  u.email::text
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = u.id);

-- Point appointments.user_id at profiles(user_id) so PostgREST can embed profiles on appointments
ALTER TABLE public.appointments DROP CONSTRAINT IF EXISTS appointments_user_id_fkey;

ALTER TABLE public.appointments
ADD CONSTRAINT appointments_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles (user_id)
ON DELETE CASCADE;

-- Broad read access for authenticated clients (therapist dashboard embeds + user profile UX)
DROP POLICY IF EXISTS "Allow read profiles" ON public.profiles;

CREATE POLICY "Allow read profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);
