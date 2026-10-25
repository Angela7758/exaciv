CREATE OR REPLACE FUNCTION public.start_classified_practice(p_count integer DEFAULT 10,p_type text DEFAULT 'all',p_theme text DEFAULT NULL,p_correction text DEFAULT 'immediate',p_chrono boolean DEFAULT false) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE path text; qs jsonb; sid uuid; available integer; effective integer; rules jsonb;
BEGIN
IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Connectez-vous pour commencer.'; END IF;
IF p_count IS NULL OR p_count NOT IN (5,10,20) THEN RAISE EXCEPTION 'Choisissez exactement 5, 10 ou 20 questions.'; END IF;
IF p_type IS NULL OR p_type NOT IN ('all','knowledge','scenario','unclassified') THEN RAISE EXCEPTION 'Type de question invalide.'; END IF;
IF p_correction IS NULL OR p_correction NOT IN ('immediate','fin') THEN RAISE EXCEPTION 'Correction invalide.'; END IF;
SELECT parcours INTO path FROM public.profiles WHERE id=auth.uid(); IF path IS NULL THEN RAISE EXCEPTION 'Profil indisponible.'; END IF;
PERFORM pg_advisory_xact_lock(hashtext(auth.uid()::text||path||'practice'));
SELECT count(*) INTO available FROM public.learning_questions WHERE published AND path=ANY(pathways) AND (p_theme IS NULL OR public.civic_topic(coalesce(exam_theme,theme))=public.civic_topic(p_theme)) AND (p_type='all' OR question_type=p_type) AND (p_type NOT IN ('knowledge','scenario') OR classification_reviewed_at IS NOT NULL);
IF available=0 THEN RAISE EXCEPTION 'Aucune question publiée pour ce thème'; END IF;
effective:=least(p_count,available);
rules:=jsonb_build_object('question_type',p_type,'theme',p_theme,'correction',p_correction,'chrono',p_chrono,'allow_aids',true);
SELECT id INTO sid FROM public.learning_sessions WHERE user_id=auth.uid() AND parcours=path AND kind='practice' AND completed_at IS NULL AND test_id IS NULL AND total=effective AND test_rules=rules ORDER BY started_at DESC LIMIT 1;
IF sid IS NOT NULL THEN RETURN sid; END IF;
SELECT jsonb_agg(to_jsonb(q) ORDER BY q.position) INTO qs FROM (SELECT * FROM public.learning_questions WHERE published AND path=ANY(pathways) AND (p_theme IS NULL OR public.civic_topic(coalesce(exam_theme,theme))=public.civic_topic(p_theme)) AND (p_type='all' OR question_type=p_type) AND (p_type NOT IN ('knowledge','scenario') OR classification_reviewed_at IS NOT NULL) ORDER BY position LIMIT effective) q;
IF qs IS NULL OR jsonb_array_length(qs)<>effective THEN RAISE EXCEPTION 'Catalogue modifié : réessayez.'; END IF;
INSERT INTO public.learning_sessions(user_id,parcours,kind,questions,total,test_rules) VALUES(auth.uid(),path,'practice',qs,effective,rules) RETURNING id INTO sid;
RETURN sid;
END $$;
REVOKE ALL ON FUNCTION public.start_classified_practice(integer,text,text,text,boolean) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.start_classified_practice(integer,text,text,text,boolean) TO authenticated;
COMMENT ON FUNCTION public.start_classified_practice(integer,text,text,text,boolean) IS 'Batch 1: requested counts remain 5/10/20; server clamps to published availability without changing historical sessions.';