-- Supprime la surcharge obsolète à deux arguments de public.start_learning_session.
-- La migration 0026 a créé une version à trois arguments avec CREATE OR REPLACE,
-- ce qui a ajouté une surcharge au lieu de remplacer : un appel sans p_count était ambigu.
DROP FUNCTION IF EXISTS public.start_learning_session(text, text);

-- Réaffirme les droits sur la signature conservée (trois arguments).
REVOKE ALL ON FUNCTION public.start_learning_session(text, text, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.start_learning_session(text, text, integer) FROM anon;
GRANT EXECUTE ON FUNCTION public.start_learning_session(text, text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.start_learning_session(text, text, integer) TO service_role;

-- ROLLBACK (commenté) : recrée l'ancienne signature à deux arguments, copiée de la migration 0014.
-- CREATE OR REPLACE FUNCTION public.start_learning_session(p_kind text,p_lesson text DEFAULT NULL) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
-- DECLARE qs jsonb; sid uuid; expired_id uuid; p text; expected integer; selected_theme text;
-- BEGIN
-- IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Connectez-vous pour commencer.'; END IF;
-- IF p_kind NOT IN ('practice','lesson','exam') THEN RAISE EXCEPTION 'Session invalide.'; END IF;
-- SELECT parcours INTO p FROM public.profiles WHERE id=auth.uid(); IF p IS NULL THEN RAISE EXCEPTION 'Profil indisponible.'; END IF;
-- PERFORM pg_advisory_xact_lock(hashtext(auth.uid()::text || p || p_kind));
-- IF p_kind='exam' THEN FOR expired_id IN SELECT id FROM public.learning_sessions WHERE user_id=auth.uid() AND parcours=p AND kind='exam' AND completed_at IS NULL AND deadline<=now() LOOP PERFORM public.finish_learning_session(expired_id); END LOOP; END IF;
-- IF p_kind='practice' AND p_lesson LIKE 'theme:%' THEN selected_theme:=substring(p_lesson from 7); END IF;
-- SELECT id INTO sid FROM public.learning_sessions WHERE user_id=auth.uid() AND parcours=p AND kind=p_kind AND completed_at IS NULL AND (p_kind<>'lesson' OR lesson_id=p_lesson) AND (selected_theme IS NULL OR questions->0->>'theme'=selected_theme) ORDER BY started_at DESC LIMIT 1;
-- IF sid IS NOT NULL THEN RETURN sid; END IF;
-- expected:=CASE p_kind WHEN 'exam' THEN 40 WHEN 'lesson' THEN 5 ELSE 10 END;
-- IF p_kind='lesson' AND NOT EXISTS(SELECT 1 FROM public.learning_lessons WHERE id=p_lesson AND published) THEN RAISE EXCEPTION 'Leçon indisponible.'; END IF;
-- IF p_kind='exam' THEN
-- SELECT jsonb_agg(to_jsonb(q)-'rn'||jsonb_build_object('theme',q.exam_theme) ORDER BY q.exam_theme,q.position) INTO qs FROM (SELECT *,row_number() OVER(PARTITION BY exam_theme ORDER BY position) rn FROM public.learning_questions WHERE published AND exam_theme IN ('Institutions','Valeurs de la République','Histoire','Droits et devoirs','France et Europe')) q WHERE rn<=8;
-- ELSE
-- SELECT jsonb_agg(to_jsonb(q)) INTO qs FROM (SELECT * FROM public.learning_questions WHERE published AND (p_kind<>'lesson' OR lesson_id=p_lesson) AND (selected_theme IS NULL OR theme=selected_theme OR exam_theme=selected_theme) ORDER BY position LIMIT expected) q;
-- IF p_kind='practice' AND selected_theme IS NOT NULL AND qs IS NOT NULL THEN expected:=jsonb_array_length(qs); END IF;
-- END IF;
-- IF qs IS NULL OR jsonb_array_length(qs)<>expected OR expected=0 THEN RAISE EXCEPTION 'Le catalogue ne contient pas encore assez de questions pour cette session.'; END IF;
-- INSERT INTO public.learning_sessions(user_id,parcours,kind,lesson_id,questions,total,deadline) VALUES(auth.uid(),p,p_kind,CASE WHEN p_kind='lesson' THEN p_lesson ELSE NULL END,qs,expected,CASE WHEN p_kind='exam' THEN now()+interval '45 minutes' ELSE NULL END) RETURNING id INTO sid;
-- RETURN sid;
-- END $$;