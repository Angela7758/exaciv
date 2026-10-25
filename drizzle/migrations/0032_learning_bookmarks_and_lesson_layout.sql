CREATE TABLE public.learning_bookmarks (
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('question', 'lesson')),
  item_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, kind, item_id)
);
GRANT SELECT, INSERT, DELETE ON public.learning_bookmarks TO authenticated;
GRANT ALL ON public.learning_bookmarks TO service_role;
ALTER TABLE public.learning_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY bookmarks_owner_read ON public.learning_bookmarks FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY bookmarks_owner_insert ON public.learning_bookmarks FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY bookmarks_owner_delete ON public.learning_bookmarks FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));
ALTER TABLE public.learning_lessons ADD COLUMN layout jsonb;
UPDATE public.learning_lessons SET layout = '{"objectives":["Comprendre les trois principes de la devise.","Les reconnaître dans la vie quotidienne."],"pillars":[{"key":"liberte","title":"Liberté","text":"Chacun peut penser, s''exprimer, croire ou ne pas croire, dans le respect des lois et des autres."},{"key":"egalite","title":"Égalité","text":"Tous les citoyens ont les mêmes droits et les mêmes devoirs, sans distinction d''origine, de religion, de sexe ou de situation sociale."},{"key":"fraternite","title":"Fraternité","text":"La République encourage la solidarité et le respect entre tous les citoyens."}],"example":{"title":"Exemple : à l''école","text":"Les filles et les garçons ont accès aux mêmes enseignements et aux mêmes opportunités. C''est une application concrète du principe d''égalité."}}'::jsonb WHERE title = 'La devise de la République';
-- Rollback (manual, after reverting consumers):
-- ALTER TABLE public.learning_lessons DROP COLUMN layout;
-- DROP TABLE public.learning_bookmarks;
