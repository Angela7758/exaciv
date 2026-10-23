CREATE TABLE public.learning_agenda (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL DEFAULT auth.uid(),
 title text NOT NULL,
 kind text NOT NULL DEFAULT 'lesson',
 lesson_id text REFERENCES public.learning_lessons(id),
 test_id uuid REFERENCES public.learning_tests(id),
 scheduled_date date NOT NULL,
 scheduled_time time,
 timezone text NOT NULL DEFAULT 'Europe/Paris',
 duration_minutes integer NOT NULL DEFAULT 15,
 completed boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT agenda_title_length CHECK (length(trim(title)) BETWEEN 1 AND 180),
 CONSTRAINT agenda_kind CHECK (kind IN ('lesson','practice','exam','revision')),
 CONSTRAINT agenda_duration CHECK (duration_minutes BETWEEN 1 AND 480)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_agenda TO authenticated;
GRANT ALL ON public.learning_agenda TO service_role;
ALTER TABLE public.learning_agenda ENABLE ROW LEVEL SECURITY;
CREATE POLICY agenda_owner ON public.learning_agenda FOR ALL TO authenticated USING (user_id=auth.uid()) WITH CHECK (user_id=auth.uid());
CREATE INDEX learning_agenda_owner_date ON public.learning_agenda(user_id,scheduled_date);
ALTER TABLE public.profiles ADD COLUMN timezone text NOT NULL DEFAULT 'Europe/Paris';