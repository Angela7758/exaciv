ALTER TABLE public.learning_questions ADD COLUMN exam_theme text;
CREATE OR REPLACE FUNCTION public.start_learning_session(p_kind text,p_lesson text DEFAULT NULL) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE qs jsonb; sid uuid; p text; expected integer; BEGIN
IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
IF p_kind NOT IN ('practice','lesson','exam') THEN RAISE EXCEPTION 'Invalid session'; END IF;
SELECT parcours INTO p FROM public.profiles WHERE id=auth.uid(); IF p IS NULL THEN RAISE EXCEPTION 'Profile unavailable'; END IF;
expected:=CASE p_kind WHEN 'exam' THEN 40 WHEN 'lesson' THEN 5 ELSE 10 END;
IF p_kind='lesson' AND NOT EXISTS(SELECT 1 FROM public.learning_lessons WHERE id=p_lesson AND published) THEN RAISE EXCEPTION 'Lesson unavailable'; END IF;
IF p_kind='exam' THEN SELECT jsonb_agg(to_jsonb(q)-'rn'||jsonb_build_object('theme',q.exam_theme) ORDER BY q.exam_theme,q.position) INTO qs FROM (SELECT *,row_number() OVER(PARTITION BY exam_theme ORDER BY position) rn FROM public.learning_questions WHERE published AND exam_theme IN ('Institutions','Valeurs de la République','Histoire','Droits et devoirs','France et Europe')) q WHERE rn<=8;
ELSE SELECT jsonb_agg(to_jsonb(q)) INTO qs FROM (SELECT * FROM public.learning_questions WHERE published AND (p_kind<>'lesson' OR lesson_id=p_lesson) ORDER BY position LIMIT expected) q; END IF;
IF qs IS NULL OR jsonb_array_length(qs)<>expected THEN RAISE EXCEPTION 'Le catalogue ne contient pas encore assez de questions pour cette session.'; END IF;
INSERT INTO public.learning_sessions(user_id,parcours,kind,lesson_id,questions,total,deadline) VALUES(auth.uid(),p,p_kind,p_lesson,qs,expected,CASE WHEN p_kind='exam' THEN now()+interval '45 minutes' ELSE NULL END) RETURNING id INTO sid; RETURN sid; END $$;