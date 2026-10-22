CREATE TABLE public.revision_plans (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),inputs jsonb NOT NULL,plan jsonb NOT NULL);
GRANT SELECT,INSERT ON public.revision_plans TO authenticated;
GRANT ALL ON public.revision_plans TO service_role;
ALTER TABLE public.revision_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY revision_plans_owner_read ON public.revision_plans FOR SELECT TO authenticated USING(user_id=auth.uid());
CREATE POLICY revision_plans_owner_insert ON public.revision_plans FOR INSERT TO authenticated WITH CHECK(user_id=auth.uid());
CREATE TABLE public.ai_revision_service_state (id text PRIMARY KEY, status integer NOT NULL,message text NOT NULL,updated_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.ai_revision_service_state TO service_role;
ALTER TABLE public.ai_revision_service_state ENABLE ROW LEVEL SECURITY;