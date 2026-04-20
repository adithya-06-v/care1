-- Ensure user_id is UNIQUE so PostgREST upsert ... onConflict('user_id') works.
-- Baseline migration may already define user_weakness_user_id_key; this is idempotent.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'user_weakness'
  ) AND NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    WHERE t.relname = 'user_weakness'
      AND c.contype = 'u'
      AND pg_get_constraintdef(c.oid) LIKE '%user_id%'
  ) THEN
    ALTER TABLE public.user_weakness
    ADD CONSTRAINT unique_user_weakness_user_id UNIQUE (user_id);
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN duplicate_table THEN NULL;
END $$;
