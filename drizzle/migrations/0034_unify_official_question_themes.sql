-- Unification des thèmes : exam_theme fait autorité et theme lui est égal (cinq thèmes officiels).
-- Correspondance des 41 questions revue par la propriétaire (13 lignes provisoires).
CREATE TEMP TABLE theme_map(id text PRIMARY KEY, official text NOT NULL) ON COMMIT DROP;
INSERT INTO theme_map(id,official) VALUES
('q1','Principes et valeurs de la République française'),
('q2','Principes et valeurs de la République française'),
('q6','Principes et valeurs de la République française'),
('q8','Principes et valeurs de la République française'),
('q10','Principes et valeurs de la République française'),
('laicite-2','Principes et valeurs de la République française'),
('laicite-3','Principes et valeurs de la République française'),
('laicite-4','Principes et valeurs de la République française'),
('laicite-5','Principes et valeurs de la République française'),
('exam-6','Principes et valeurs de la République française'),
('exam-7','Principes et valeurs de la République française'),
('q3','Système institutionnel et politique'),
('q4','Système institutionnel et politique'),
('q9','Système institutionnel et politique'),
('practice-parlement-role','Système institutionnel et politique'),
('exam-1','Système institutionnel et politique'),
('exam-2','Système institutionnel et politique'),
('exam-3','Système institutionnel et politique'),
('exam-4','Système institutionnel et politique'),
('exam-5','Système institutionnel et politique'),
('exam-24','Système institutionnel et politique'),
('exam-25','Système institutionnel et politique'),
('exam-26','Système institutionnel et politique'),
('q5','Droits et devoirs'),
('q7','Droits et devoirs'),
('exam-13','Droits et devoirs'),
('exam-14','Droits et devoirs'),
('exam-15','Droits et devoirs'),
('exam-16','Droits et devoirs'),
('exam-17','Droits et devoirs'),
('exam-18','Droits et devoirs'),
('exam-8','Histoire, géographie et culture'),
('exam-9','Histoire, géographie et culture'),
('exam-10','Histoire, géographie et culture'),
('exam-11','Histoire, géographie et culture'),
('exam-12','Histoire, géographie et culture'),
('exam-19','Histoire, géographie et culture'),
('exam-20','Histoire, géographie et culture'),
('exam-21','Histoire, géographie et culture'),
('exam-22','Histoire, géographie et culture'),
('exam-23','Histoire, géographie et culture');
DO $$ BEGIN
 IF (SELECT count(*) FROM theme_map)<>41 OR (SELECT count(*) FROM public.learning_questions q JOIN theme_map m USING(id))<>41 THEN RAISE EXCEPTION 'Unification annulée : les 41 questions attendues ne sont pas toutes présentes.'; END IF;
 IF EXISTS(SELECT 1 FROM public.learning_questions q WHERE q.published AND NOT EXISTS(SELECT 1 FROM theme_map m WHERE m.id=q.id)) THEN RAISE EXCEPTION 'Unification annulée : une question publiée hors liste existe.'; END IF;
END $$;
UPDATE public.learning_questions q SET theme=m.official,exam_theme=m.official FROM theme_map m WHERE q.id=m.id;
CREATE TEMP TABLE draft_before ON COMMIT DROP AS SELECT d.* FROM public.question_drafts d JOIN theme_map m USING(id) WHERE d.payload->>'theme' IS DISTINCT FROM m.official OR d.payload->>'exam_theme' IS DISTINCT FROM m.official;
UPDATE public.question_drafts d SET payload=d.payload||jsonb_build_object('theme',m.official,'exam_theme',m.official),revision=d.revision+1,updated_at=now() FROM theme_map m WHERE d.id=m.id AND d.id IN (SELECT id FROM draft_before);
INSERT INTO public.question_versions(question_id,revision,payload,status,created_by) SELECT d.id,d.revision,d.payload,d.status,NULL FROM public.question_drafts d WHERE d.id IN (SELECT id FROM draft_before);
INSERT INTO public.admin_audit(actor,action,entity_id,before_data,after_data) SELECT NULL,'migration_theme_unification',b.id,to_jsonb(b),to_jsonb(d) FROM draft_before b JOIN public.question_drafts d USING(id);
UPDATE public.learning_lessons SET topic=public.civic_topic(topic) WHERE topic IS DISTINCT FROM public.civic_topic(topic);
UPDATE public.lesson_drafts SET payload=payload||jsonb_build_object('topic',public.civic_topic(payload->>'topic')) WHERE payload ? 'topic' AND payload->>'topic' IS DISTINCT FROM public.civic_topic(payload->>'topic');
ALTER TABLE public.learning_questions ADD CONSTRAINT learning_questions_official_theme CHECK (exam_theme IN ('Principes et valeurs de la République française','Système institutionnel et politique','Droits et devoirs','Histoire, géographie et culture','Vivre dans la société française') AND theme=exam_theme);

CREATE OR REPLACE FUNCTION public.admin_validate_question(p jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$ DECLARE ids text[]; correct text; BEGIN IF coalesce(p->>'id','') !~ '^[A-Za-z0-9_-]{1,100}$' OR length(trim(coalesce(p->>'question','')))<8 OR length(trim(coalesce(p->>'explanation','')))<8 OR jsonb_typeof(p->'options') IS DISTINCT FROM 'array' OR jsonb_array_length(p->'options')<>4 THEN RAISE EXCEPTION 'Question invalide : ID, texte, explication et quatre options requis.'; END IF;
SELECT array_agg(x->>'id') INTO ids FROM jsonb_array_elements(p->'options') x; correct:=p->>'correct_option_id'; IF (SELECT count(DISTINCT x) FROM unnest(ids) x)<>4 OR EXISTS(SELECT 1 FROM jsonb_array_elements(p->'options') x WHERE coalesce(x->>'id','')='' OR trim(coalesce(x->>'text',''))='') OR correct IS NULL OR NOT(correct=ANY(ids)) THEN RAISE EXCEPTION 'Identifiants des options ou bonne réponse invalides.'; END IF;
IF coalesce(p->>'exam_theme','') NOT IN ('Principes et valeurs de la République française','Système institutionnel et politique','Droits et devoirs','Histoire, géographie et culture','Vivre dans la société française') OR coalesce(p->>'theme','')<>coalesce(p->>'exam_theme','') OR jsonb_typeof(p->'pathways') IS DISTINCT FROM 'array' OR jsonb_array_length(p->'pathways')=0 OR EXISTS(SELECT 1 FROM jsonb_array_elements_text(p->'pathways') x WHERE x NOT IN ('naturalisation','resident','sejour')) THEN RAISE EXCEPTION 'Thème officiel ou parcours invalide.'; END IF;
IF coalesce(p->>'difficulty','') NOT IN ('easy','standard','hard') THEN RAISE EXCEPTION 'Difficulté invalide.'; END IF;
IF coalesce(p->>'lesson_id','')<>'' AND NOT EXISTS(SELECT 1 FROM public.learning_lessons WHERE id=p->>'lesson_id') THEN RAISE EXCEPTION 'Leçon inconnue.'; END IF;
IF EXISTS(SELECT 1 FROM public.question_drafts WHERE id<>p->>'id' AND lower(regexp_replace(payload->>'question','\s+',' ','g'))=lower(regexp_replace(p->>'question','\s+',' ','g'))) THEN RAISE EXCEPTION 'Un autre ID utilise déjà ce texte de question.'; END IF;
IF coalesce(p->'translations','{}'::jsonb)<>'{}'::jsonb THEN IF jsonb_typeof(p->'translations')<>'object' THEN RAISE EXCEPTION 'Traductions invalides.'; END IF; IF EXISTS(SELECT 1 FROM jsonb_each(p->'translations') t WHERE t.key NOT IN ('zh','en','ar','es','ru') OR coalesce(t.value->>'question','')='' OR jsonb_typeof(t.value->'options') IS DISTINCT FROM 'object' OR EXISTS(SELECT 1 FROM unnest(ids) oid WHERE coalesce(t.value->'options'->>oid,'')='') OR (SELECT count(*) FROM jsonb_object_keys(t.value->'options'))<>4) THEN RAISE EXCEPTION 'Les traductions doivent correspondre aux identifiants des quatre options.'; END IF; END IF;
END $function$;

-- Composition de l'examen : 8 questions par thème officiel (exam_theme), 40 au total.
CREATE OR REPLACE FUNCTION public.start_learning_session(p_kind text, p_lesson text DEFAULT NULL::text, p_count integer DEFAULT NULL::integer)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE qs jsonb; sid uuid; expired_id uuid; p text; expected integer; selected_theme text;
BEGIN
IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Connectez-vous pour commencer.'; END IF;
IF p_kind='practice' AND p_count IS NOT NULL AND p_count NOT IN (5,10,20) THEN RAISE EXCEPTION 'Choisissez exactement 5, 10 ou 20 questions.'; END IF; IF p_kind NOT IN ('practice','lesson','exam') THEN RAISE EXCEPTION 'Session invalide.'; END IF;
SELECT parcours INTO p FROM public.profiles WHERE id=auth.uid(); IF p IS NULL THEN RAISE EXCEPTION 'Profil indisponible.'; END IF;
PERFORM pg_advisory_xact_lock(hashtext(auth.uid()::text || p || p_kind));
IF p_kind='exam' THEN FOR expired_id IN SELECT id FROM public.learning_sessions WHERE user_id=auth.uid() AND parcours=p AND kind='exam' AND completed_at IS NULL AND deadline<=now() LOOP PERFORM public.finish_learning_session(expired_id); END LOOP; END IF;
IF p_kind='practice' AND p_lesson LIKE 'theme:%' THEN selected_theme:=substring(p_lesson from 7); END IF;
expected:=CASE p_kind WHEN 'exam' THEN 40 WHEN 'lesson' THEN 5 ELSE COALESCE(p_count,10) END;
SELECT id INTO sid FROM public.learning_sessions WHERE user_id=auth.uid() AND parcours=p AND kind=p_kind AND completed_at IS NULL AND test_id IS NULL AND (p_kind<>'lesson' OR lesson_id=p_lesson) AND (p_kind<>'practice' OR total=expected) AND (selected_theme IS NULL OR questions->0->>'theme'=selected_theme) ORDER BY started_at DESC LIMIT 1;
IF sid IS NOT NULL THEN RETURN sid; END IF;
IF p_kind='lesson' AND NOT EXISTS(SELECT 1 FROM public.learning_lessons WHERE id=p_lesson AND published) THEN RAISE EXCEPTION 'Leçon indisponible.'; END IF;
IF p_kind='exam' THEN
SELECT jsonb_agg(to_jsonb(q)-'rn' ORDER BY array_position(ARRAY['Principes et valeurs de la République française','Système institutionnel et politique','Droits et devoirs','Histoire, géographie et culture','Vivre dans la société française'],q.exam_theme),q.position) INTO qs FROM (SELECT *,row_number() OVER(PARTITION BY exam_theme ORDER BY position) rn FROM public.learning_questions WHERE published AND p=ANY(pathways) AND exam_theme IN ('Principes et valeurs de la République française','Système institutionnel et politique','Droits et devoirs','Histoire, géographie et culture','Vivre dans la société française')) q WHERE rn<=8;
ELSE
SELECT jsonb_agg(to_jsonb(q)) INTO qs FROM (SELECT * FROM public.learning_questions WHERE published AND p=ANY(pathways) AND (p_kind<>'lesson' OR lesson_id=p_lesson) AND (selected_theme IS NULL OR theme=selected_theme OR exam_theme=selected_theme) ORDER BY position LIMIT expected) q;

END IF;
IF qs IS NULL OR jsonb_array_length(qs)<>expected OR expected=0 THEN RAISE EXCEPTION 'Le catalogue ne contient pas encore assez de questions pour cette session.'; END IF;
INSERT INTO public.learning_sessions(user_id,parcours,kind,lesson_id,questions,total,deadline) VALUES(auth.uid(),p,p_kind,CASE WHEN p_kind='lesson' THEN p_lesson ELSE NULL END,qs,expected,CASE WHEN p_kind='exam' THEN now()+interval '45 minutes' ELSE NULL END) RETURNING id INTO sid;
RETURN sid;
END $function$;

-- ROLLBACK (commenté) : restaure theme/exam_theme relevés avant migration (contrôle préalable du 26/10).
-- ALTER TABLE public.learning_questions DROP CONSTRAINT learning_questions_official_theme;
-- UPDATE public.learning_questions q SET theme=v.t,exam_theme=v.e FROM (VALUES
-- ('exam-1','Institutions','Institutions'),('exam-2','Institutions','Institutions'),('exam-3','Institutions','Institutions'),('exam-4','Institutions','Institutions'),('exam-5','Institutions','Institutions'),
-- ('exam-6','Valeurs de la République','Valeurs de la République'),('exam-7','Valeurs de la République','Valeurs de la République'),
-- ('exam-8','Histoire','Histoire'),('exam-9','Histoire','Histoire'),('exam-10','Histoire','Histoire'),('exam-11','Histoire','Histoire'),('exam-12','Histoire','Histoire'),
-- ('exam-13','Droits et devoirs','Droits et devoirs'),('exam-14','Droits et devoirs','Droits et devoirs'),('exam-15','Droits et devoirs','Droits et devoirs'),('exam-16','Droits et devoirs','Droits et devoirs'),('exam-17','Droits et devoirs','Droits et devoirs'),('exam-18','Droits et devoirs','Droits et devoirs'),
-- ('exam-19','France et Europe','France et Europe'),('exam-20','France et Europe','France et Europe'),('exam-21','France et Europe','France et Europe'),('exam-22','France et Europe','France et Europe'),('exam-23','France et Europe','France et Europe'),('exam-24','France et Europe','France et Europe'),('exam-25','France et Europe','France et Europe'),('exam-26','France et Europe','France et Europe'),
-- ('laicite-2','Valeurs de la République','Valeurs de la République'),('laicite-3','Valeurs de la République','Valeurs de la République'),('laicite-4','Valeurs de la République','Valeurs de la République'),('laicite-5','Valeurs de la République','Valeurs de la République'),
-- ('practice-parlement-role','Institutions','Institutions'),('q1','Principes et valeurs','Valeurs de la République'),('q2','Principes et valeurs','Valeurs de la République'),('q3','Institutions','Institutions'),('q4','Institutions','Institutions'),('q5','Droits et devoirs','Droits et devoirs'),
-- ('q6','Histoire et symboles','Histoire'),('q7','Droits et devoirs','Droits et devoirs'),('q8','Histoire et symboles','Histoire'),('q9','Institutions','Institutions'),('q10','Histoire et symboles','Histoire')
-- ) v(id,t,e) WHERE q.id=v.id;
