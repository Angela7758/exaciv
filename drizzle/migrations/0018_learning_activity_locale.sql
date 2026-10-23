CREATE TABLE public.learning_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  locale text NOT NULL CHECK (locale IN ('fr','zh','en','ar','es','ru','pt')),
  kind text NOT NULL CHECK (kind IN ('lesson','video','session')),
  ref text NOT NULL CHECK (char_length(ref) BETWEEN 1 AND 80),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, kind, ref, locale)
);
GRANT SELECT, INSERT ON public.learning_activity TO authenticated;
GRANT ALL ON public.learning_activity TO service_role;
ALTER TABLE public.learning_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own activity read" ON public.learning_activity FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Own activity insert" ON public.learning_activity FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());