CREATE OR REPLACE FUNCTION public.save_exam_navigation(p_session uuid,p_index integer,p_answer integer DEFAULT NULL,p_target integer DEFAULT NULL) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE s public.learning_sessions; BEGIN
IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
SELECT * INTO s FROM public.learning_sessions WHERE id=p_session AND user_id=auth.uid() FOR UPDATE;
IF NOT FOUND OR s.kind<>'exam' THEN RAISE EXCEPTION 'Exam unavailable'; END IF;
IF s.completed_at IS NOT NULL THEN RAISE EXCEPTION 'Exam completed'; END IF;
IF now()>=s.deadline THEN RAISE EXCEPTION 'Le temps est écoulé.'; END IF;
IF p_index<>s.current_index THEN RAISE EXCEPTION 'Question changed; reload'; END IF;
IF p_answer IS NOT NULL THEN
IF p_answer<0 OR p_answer>=jsonb_array_length(s.questions->p_index->'options') THEN RAISE EXCEPTION 'Invalid answer'; END IF;
s.answers:=s.answers||jsonb_build_object(p_index::text,p_answer);
END IF;
IF p_target IS NOT NULL THEN
IF p_target<0 OR p_target>=s.total THEN RAISE EXCEPTION 'Question indisponible.'; END IF;
s.current_index:=p_target;
END IF;
UPDATE public.learning_sessions SET answers=s.answers,current_index=s.current_index WHERE id=s.id;
END $$;
REVOKE ALL ON FUNCTION public.save_exam_navigation(uuid,integer,integer,integer) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.save_exam_navigation(uuid,integer,integer,integer) TO authenticated;