ALTER TABLE public.learning_lessons ADD COLUMN source_url text, ADD COLUMN minutes integer NOT NULL DEFAULT 8, ADD COLUMN takeaway text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.learning_questions ADD COLUMN lesson_id text REFERENCES public.learning_lessons(id), ADD COLUMN source_url text;
CREATE TABLE public.learning_sessions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,parcours text NOT NULL,kind text NOT NULL CHECK(kind IN ('practice','lesson','exam')),lesson_id text REFERENCES public.learning_lessons(id),questions jsonb NOT NULL,answers jsonb NOT NULL DEFAULT '{}',current_index integer NOT NULL DEFAULT 0,started_at timestamptz NOT NULL DEFAULT now(),deadline timestamptz,completed_at timestamptz,correct integer,total integer NOT NULL);
GRANT SELECT ON public.learning_sessions TO authenticated; GRANT ALL ON public.learning_sessions TO service_role;
ALTER TABLE public.learning_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own learning sessions" ON public.learning_sessions FOR SELECT TO authenticated USING(user_id=auth.uid());
CREATE INDEX learning_sessions_owner ON public.learning_sessions(user_id,started_at DESC);
CREATE FUNCTION public.start_learning_session(p_kind text,p_lesson text DEFAULT NULL) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE qs jsonb; sid uuid; p text; expected integer; BEGIN
IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
IF p_kind NOT IN ('practice','lesson','exam') THEN RAISE EXCEPTION 'Invalid session'; END IF;
SELECT parcours INTO p FROM public.profiles WHERE id=auth.uid(); IF p IS NULL THEN RAISE EXCEPTION 'Profile unavailable'; END IF;
expected:=CASE p_kind WHEN 'exam' THEN 40 WHEN 'lesson' THEN 5 ELSE 10 END;
IF p_kind='lesson' AND NOT EXISTS(SELECT 1 FROM public.learning_lessons WHERE id=p_lesson AND published) THEN RAISE EXCEPTION 'Lesson unavailable'; END IF;
SELECT jsonb_agg(to_jsonb(q)) INTO qs FROM (SELECT * FROM public.learning_questions WHERE published AND (p_kind<>'lesson' OR lesson_id=p_lesson) ORDER BY position LIMIT expected) q;
IF qs IS NULL OR jsonb_array_length(qs)<>expected THEN RAISE EXCEPTION 'Le catalogue ne contient pas encore assez de questions pour cette session.'; END IF;
INSERT INTO public.learning_sessions(user_id,parcours,kind,lesson_id,questions,total,deadline) VALUES(auth.uid(),p,p_kind,p_lesson,qs,expected,CASE WHEN p_kind='exam' THEN now()+interval '45 minutes' ELSE NULL END) RETURNING id INTO sid; RETURN sid; END $$;
CREATE FUNCTION public.submit_learning_answer(p_session uuid,p_index integer,p_answer integer) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE s public.learning_sessions; q jsonb; BEGIN
IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
SELECT * INTO s FROM public.learning_sessions WHERE id=p_session AND user_id=auth.uid() FOR UPDATE; IF NOT FOUND THEN RAISE EXCEPTION 'Session unavailable'; END IF;
IF s.completed_at IS NOT NULL THEN RETURN; END IF;
IF s.deadline IS NOT NULL AND now()>=s.deadline THEN RAISE EXCEPTION 'Le temps est écoulé. Terminez votre examen.'; END IF;
IF p_index<0 OR p_index>=s.total OR p_answer<0 OR p_answer>3 THEN RAISE EXCEPTION 'Invalid answer'; END IF;
IF s.answers ? p_index::text THEN RETURN; END IF;
IF p_index<>s.current_index THEN RAISE EXCEPTION 'Répondez à la question en cours.'; END IF;
q:=s.questions->p_index; IF p_answer>=jsonb_array_length(q->'options') THEN RAISE EXCEPTION 'Invalid option'; END IF;
UPDATE public.learning_sessions SET answers=answers||jsonb_build_object(p_index::text,p_answer) WHERE id=s.id; END $$;
CREATE FUNCTION public.advance_learning_session(p_session uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE s public.learning_sessions; BEGIN
SELECT * INTO s FROM public.learning_sessions WHERE id=p_session AND user_id=auth.uid() FOR UPDATE; IF NOT FOUND THEN RAISE EXCEPTION 'Session unavailable'; END IF;
IF s.completed_at IS NOT NULL THEN RETURN; END IF;
IF NOT(s.answers ? s.current_index::text) THEN RAISE EXCEPTION 'Répondez avant de continuer.'; END IF;
UPDATE public.learning_sessions SET current_index=least(current_index+1,total-1) WHERE id=s.id; END $$;
CREATE FUNCTION public.finish_learning_session(p_session uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE s public.learning_sessions; score integer; BEGIN
SELECT * INTO s FROM public.learning_sessions WHERE id=p_session AND user_id=auth.uid() FOR UPDATE; IF NOT FOUND THEN RAISE EXCEPTION 'Session unavailable'; END IF;
IF s.completed_at IS NOT NULL THEN RETURN; END IF;
IF (SELECT count(*) FROM jsonb_object_keys(s.answers))<>s.total AND (s.deadline IS NULL OR now()<s.deadline) THEN RAISE EXCEPTION 'Terminez les questions avant de valider.'; END IF;
SELECT count(*) INTO score FROM jsonb_array_elements(s.questions) WITH ORDINALITY q(value,n) WHERE (s.answers->>((n-1)::text))::integer=(value->>'answer')::integer;
UPDATE public.learning_sessions SET correct=score,completed_at=CASE WHEN s.deadline IS NOT NULL THEN least(now(),s.deadline) ELSE now() END WHERE id=s.id; END $$;
REVOKE ALL ON FUNCTION public.start_learning_session(text,text),public.submit_learning_answer(uuid,integer,integer),public.advance_learning_session(uuid),public.finish_learning_session(uuid) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.start_learning_session(text,text),public.submit_learning_answer(uuid,integer,integer),public.advance_learning_session(uuid),public.finish_learning_session(uuid) TO authenticated;