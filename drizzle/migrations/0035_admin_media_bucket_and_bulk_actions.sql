-- Section 4: uploaded admin media metadata (additive).
ALTER TABLE public.admin_media ADD COLUMN alt text NOT NULL DEFAULT '';
ALTER TABLE public.admin_media ADD COLUMN storage_path text;
ALTER TABLE public.admin_media ADD COLUMN mime text;
ALTER TABLE public.admin_media ADD COLUMN size_bytes integer;

-- Section 2: a published lesson may point at one verified uploaded hero image.
ALTER TABLE public.learning_lessons ADD COLUMN hero_media_id text;

-- Section 4: storage policies for the private admin-media bucket.
-- Writes (and deletes) are restricted to content editors; reads to content roles.
-- Learner-facing display of a verified image goes through a server-generated signed URL
-- (service role), issued only when the admin_media row is verified = true.
CREATE POLICY admin_media_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id='admin-media' AND public.admin_can('edit'));
CREATE POLICY admin_media_update ON storage.objects FOR UPDATE TO authenticated USING (bucket_id='admin-media' AND public.admin_can('edit')) WITH CHECK (bucket_id='admin-media' AND public.admin_can('edit'));
CREATE POLICY admin_media_delete ON storage.objects FOR DELETE TO authenticated USING (bucket_id='admin-media' AND public.admin_can('edit'));
CREATE POLICY admin_media_select ON storage.objects FOR SELECT TO authenticated USING (bucket_id='admin-media' AND public.admin_can('content'));

-- Section 1 + 3 + 4: bulk question updates, capped export, media deletion.
CREATE OR REPLACE FUNCTION public.admin_command(p_action text, p_data jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$ DECLARE permission text; entity text; old jsonb; result jsonb; q public.question_drafts; p jsonb; opts text[]; ids text[]; rows jsonb:='[]'; errors integer:=0; duplicates integer:=0; successes integer:=0; x jsonb; t public.learning_tests; role_count integer; new_theme text; new_type text; new_source text; bid text; BEGIN
permission:=CASE WHEN p_action IN ('question_save','question_import','question_submit','question_restore','test_save','lesson_save','translation_save','media_save') THEN 'edit' WHEN p_action IN ('question_verify','question_publish','question_offline','test_publish','test_offline','translation_review','lesson_publish','media_verify') THEN 'publish' WHEN p_action='role_set' THEN 'roles' WHEN p_action='report_update' THEN 'reports' WHEN p_action IN ('questions_bulk_update','questions_export','media_delete') THEN 'edit' ELSE 'none' END;
IF NOT public.admin_can(permission) THEN RAISE EXCEPTION 'Accès refusé : permission requise.' USING ERRCODE='42501'; END IF; entity:=coalesce(p_data->>'id','');
IF p_action='question_import' THEN
 IF jsonb_typeof(p_data->'rows') IS DISTINCT FROM 'array' OR jsonb_array_length(p_data->'rows')>500 THEN RAISE EXCEPTION 'Import limité à 500 lignes.'; END IF;
 FOR x IN SELECT value FROM jsonb_array_elements(p_data->'rows') LOOP
 BEGIN p:=x->'payload'; PERFORM public.admin_validate_question(p); SELECT * INTO q FROM public.question_drafts WHERE id=p->>'id' FOR UPDATE; old:=to_jsonb(q);
 IF FOUND AND q.payload=p THEN duplicates:=duplicates+1;rows:=rows||jsonb_build_array(jsonb_build_object('row',x->'row','id',p->>'id','status','duplicate')); CONTINUE; END IF;
 IF q.id IS NOT NULL AND (NOT coalesce((x->>'update')::boolean,false) OR coalesce((x->>'revision')::integer,0)<>q.revision) THEN RAISE EXCEPTION 'Modification non confirmée ou version modifiée : relancez la prévisualisation.'; END IF;
 INSERT INTO public.question_drafts(id,payload,updated_by) VALUES(p->>'id',p,auth.uid()) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload,status='draft',revision=question_drafts.revision+1,updated_by=auth.uid(),updated_at=now() RETURNING * INTO q;
 INSERT INTO public.question_versions(question_id,revision,payload,status,created_by) VALUES(q.id,q.revision,q.payload,q.status,auth.uid());
 INSERT INTO public.admin_audit(actor,action,entity_id,before_data,after_data) VALUES(auth.uid(),'question_import',q.id,old,to_jsonb(q));
 INSERT INTO public.admin_translations(question_id,locale,payload,source_revision) SELECT q.id,key,value,q.revision FROM jsonb_each(coalesce(p->'translations','{}')) ON CONFLICT(question_id,locale) DO UPDATE SET payload=excluded.payload,source_revision=excluded.source_revision,status='pending',updated_at=now();
 successes:=successes+1; rows:=rows||jsonb_build_array(jsonb_build_object('row',x->'row','id',q.id,'status','draft'));
 EXCEPTION WHEN OTHERS THEN errors:=errors+1; rows:=rows||jsonb_build_array(jsonb_build_object('row',x->'row','id',x->'payload'->>'id','status','error','message',SQLERRM)); END; END LOOP;
 result:=jsonb_build_object('success',successes,'failed',errors,'duplicates',duplicates,'pending_review',successes,'rows',rows);
 INSERT INTO public.admin_imports(actor,filename,report) VALUES(auth.uid(),coalesce(p_data->>'filename','import'),result); RETURN result;
ELSIF p_action='questions_bulk_update' THEN
 IF jsonb_typeof(p_data->'ids') IS DISTINCT FROM 'array' OR jsonb_array_length(p_data->'ids')=0 OR jsonb_array_length(p_data->'ids')>200 THEN RAISE EXCEPTION 'Sélection invalide : 1 à 200 questions.'; END IF;
 new_theme:=nullif(coalesce(p_data->>'theme',''),''); new_type:=nullif(coalesce(p_data->>'question_type',''),''); new_source:=coalesce(p_data->>'classification_source','');
 IF new_theme IS NULL AND new_type IS NULL THEN RAISE EXCEPTION 'Aucune modification demandée.'; END IF;
 IF new_theme IS NOT NULL AND new_theme NOT IN ('Principes et valeurs de la République française','Système institutionnel et politique','Droits et devoirs','Histoire, géographie et culture','Vivre dans la société française') THEN RAISE EXCEPTION 'Thème officiel invalide.'; END IF;
 IF new_type IS NOT NULL AND new_type NOT IN ('knowledge','scenario','unclassified') THEN RAISE EXCEPTION 'Type de question invalide.'; END IF;
 IF new_type IS NOT NULL AND new_type<>'unclassified' AND btrim(new_source)='' THEN RAISE EXCEPTION 'Justification fiable de classification requise.'; END IF;
 successes:=0;
 FOR bid IN SELECT jsonb_array_elements_text(p_data->'ids') LOOP
  SELECT * INTO q FROM public.question_drafts WHERE id=bid FOR UPDATE;
  IF q.id IS NULL THEN RAISE EXCEPTION 'Question introuvable : %', bid; END IF;
  old:=to_jsonb(q); p:=q.payload;
  IF new_theme IS NOT NULL THEN p:=p||jsonb_build_object('theme',new_theme,'exam_theme',new_theme); END IF;
  IF new_type IS NOT NULL THEN p:=p||jsonb_build_object('question_type',new_type,'classification_source',CASE WHEN new_type='unclassified' THEN '' ELSE new_source END); END IF;
  UPDATE public.question_drafts SET payload=p,revision=revision+1,updated_at=now(),updated_by=auth.uid() WHERE id=bid RETURNING * INTO q;
  INSERT INTO public.question_versions(question_id,revision,payload,status,created_by) VALUES(q.id,q.revision,q.payload,q.status,auth.uid());
  INSERT INTO public.admin_audit(actor,action,entity_id,before_data,after_data) VALUES(auth.uid(),'questions_bulk_update',q.id,old,to_jsonb(q));
  successes:=successes+1;
 END LOOP;
 result:=jsonb_build_object('updated',successes);
ELSIF p_action='questions_export' THEN
 SELECT coalesce(jsonb_agg(to_jsonb(d)),'[]') INTO result FROM (SELECT * FROM public.question_drafts ORDER BY updated_at DESC LIMIT 2000) d;
 INSERT INTO public.admin_audit(actor,action,entity_id,before_data,after_data) VALUES(auth.uid(),'questions_export','questions',NULL,jsonb_build_object('count',jsonb_array_length(result)));
ELSIF p_action='media_delete' THEN
 SELECT to_jsonb(z) INTO old FROM public.admin_media z WHERE id=entity::uuid;
 IF old IS NULL THEN RAISE EXCEPTION 'Média introuvable.'; END IF;
 IF coalesce((old->>'verified')::boolean,false) AND EXISTS(SELECT 1 FROM public.learning_lessons l WHERE l.published AND l.hero_media_id=entity) THEN RAISE EXCEPTION 'Média vérifié utilisé par un cours publié : retrait impossible.'; END IF;
 DELETE FROM public.admin_media WHERE id=entity::uuid;
 result:=old;
ELSIF p_action LIKE 'question_%' THEN
 SELECT * INTO q FROM public.question_drafts WHERE id=entity FOR UPDATE; old:=to_jsonb(q);
 IF p_action='question_save' THEN p:=p_data->'payload'; PERFORM public.admin_validate_question(p); IF p->>'id'<>entity THEN RAISE EXCEPTION 'ID stable non modifiable.'; END IF;
 IF q.id IS NOT NULL AND coalesce((p_data->>'revision')::integer,0)<>q.revision THEN RAISE EXCEPTION 'Cette question a été modifiée. Rechargez-la.'; END IF;
 INSERT INTO public.question_drafts(id,payload,updated_by) VALUES(entity,p,auth.uid()) ON CONFLICT(id) DO UPDATE SET payload=p,status='draft',revision=question_drafts.revision+1,updated_by=auth.uid(),updated_at=now() RETURNING * INTO q;
 ELSIF q.id IS NULL THEN RAISE EXCEPTION 'Question introuvable.';
 ELSIF p_action='question_restore' THEN SELECT payload INTO p FROM public.question_versions WHERE question_id=entity AND revision=(p_data->>'version')::integer; IF p IS NULL THEN RAISE EXCEPTION 'Version inconnue.'; END IF; PERFORM public.admin_validate_question(p);UPDATE public.question_drafts SET payload=p,status='draft',revision=revision+1,updated_at=now(),updated_by=auth.uid() WHERE id=entity RETURNING * INTO q;
 ELSIF p_action='question_submit' THEN IF q.status<>'draft' OR coalesce(q.payload->>'source_url','') !~ '^https://' OR coalesce(q.payload->>'source','')='' THEN RAISE EXCEPTION 'Une source HTTPS et un brouillon sont requis.'; END IF;UPDATE public.question_drafts SET status='pending',revision=revision+1,updated_at=now(),updated_by=auth.uid() WHERE id=entity RETURNING * INTO q;
 ELSIF p_action='question_verify' THEN IF q.status<>'pending' THEN RAISE EXCEPTION 'Soumettez la question à la vérification.'; END IF;UPDATE public.question_drafts SET status='verified',revision=revision+1,updated_at=now(),updated_by=auth.uid() WHERE id=entity RETURNING * INTO q;
 ELSIF p_action='question_publish' THEN IF q.status<>'verified' THEN RAISE EXCEPTION 'Question non vérifiée : publication refusée.'; END IF;PERFORM public.admin_validate_question(q.payload); IF coalesce(q.payload->>'source_url','') !~ '^https://' OR coalesce(q.payload->>'source','')='' THEN RAISE EXCEPTION 'Source requise.'; END IF;
 SELECT array_agg(o->>'text' ORDER BY n),array_agg(o->>'id' ORDER BY n) INTO opts,ids FROM jsonb_array_elements(q.payload->'options') WITH ORDINALITY a(o,n);
 PERFORM pg_advisory_xact_lock(763100); INSERT INTO public.learning_questions(id,theme,question,options,answer,explanation,source,source_url,lesson_id,exam_theme,position,published,option_ids,correct_option_id,content_revision,pathways,source_status,source_verified_at,question_type,classification_source,classification_reviewed_at) VALUES(entity,q.payload->>'theme',q.payload->>'question',opts,array_position(ids,q.payload->>'correct_option_id')-1,q.payload->>'explanation',q.payload->>'source',q.payload->>'source_url',nullif(q.payload->>'lesson_id',''),q.payload->>'exam_theme',(SELECT coalesce(max(position),0)+1 FROM public.learning_questions),true,ids,q.payload->>'correct_option_id',q.revision+1,ARRAY(SELECT jsonb_array_elements_text(q.payload->'pathways')),'verifie',now(),coalesce(q.payload->>'question_type','unclassified'),coalesce(q.payload->>'classification_source',''),CASE WHEN coalesce(q.payload->>'question_type','unclassified')<>'unclassified' THEN now() ELSE NULL END) ON CONFLICT(id) DO UPDATE SET theme=excluded.theme,question=excluded.question,options=excluded.options,answer=excluded.answer,explanation=excluded.explanation,source=excluded.source,source_url=excluded.source_url,lesson_id=excluded.lesson_id,exam_theme=excluded.exam_theme,published=true,option_ids=excluded.option_ids,correct_option_id=excluded.correct_option_id,content_revision=excluded.content_revision,pathways=excluded.pathways,source_status='verifie',source_verified_at=now(),question_type=excluded.question_type,classification_source=excluded.classification_source,classification_reviewed_at=excluded.classification_reviewed_at; UPDATE public.question_drafts SET status='published',revision=revision+1,updated_at=now(),updated_by=auth.uid() WHERE id=entity RETURNING * INTO q;
 ELSIF p_action='question_offline' THEN UPDATE public.learning_questions SET published=false WHERE id=entity;UPDATE public.question_drafts SET status='offline',revision=revision+1,updated_at=now(),updated_by=auth.uid() WHERE id=entity RETURNING * INTO q;
 ELSE RAISE EXCEPTION 'Action inconnue.'; END IF;
 INSERT INTO public.question_versions(question_id,revision,payload,status,created_by) VALUES(q.id,q.revision,q.payload,q.status,auth.uid()); result:=to_jsonb(q);
ELSIF p_action LIKE 'test_%' THEN
 SELECT to_jsonb(z) INTO old FROM public.learning_tests z WHERE id=nullif(entity,'')::uuid FOR UPDATE;
 IF p_action='test_save' THEN p:=p_data->'payload'; entity:=coalesce(nullif(entity,''),gen_random_uuid()::text);
 INSERT INTO public.learning_tests(id,title,kind,pathways,themes,question_count,duration_minutes,selection,question_ids,instant_feedback,allow_aids,question_type) VALUES(entity::uuid,p->>'title',p->>'kind',ARRAY(SELECT jsonb_array_elements_text(p->'pathways')),ARRAY(SELECT jsonb_array_elements_text(p->'themes')),(p->>'question_count')::integer,(p->>'duration_minutes')::integer,p->>'selection',ARRAY(SELECT jsonb_array_elements_text(p->'question_ids')),(p->>'instant_feedback')::boolean,(p->>'allow_aids')::boolean,coalesce(p->>'question_type','all')) ON CONFLICT(id) DO UPDATE SET title=excluded.title,kind=excluded.kind,pathways=excluded.pathways,themes=excluded.themes,question_count=excluded.question_count,duration_minutes=excluded.duration_minutes,selection=excluded.selection,question_ids=excluded.question_ids,instant_feedback=excluded.instant_feedback,allow_aids=excluded.allow_aids,question_type=excluded.question_type,status='draft',revision=learning_tests.revision+1,updated_at=now();
 ELSIF p_action='test_publish' THEN SELECT * INTO t FROM public.learning_tests WHERE id=entity::uuid; IF t.id IS NULL OR trim(t.title)='' OR cardinality(t.pathways)=0 OR NOT(t.pathways<@ARRAY['naturalisation','resident','sejour']) OR (t.kind='free' AND t.question_count<>10) OR (t.kind='exam' AND t.duration_minutes=0) THEN RAISE EXCEPTION 'Règles du test invalides (test gratuit : 10 questions ; examen : durée requise).'; END IF;
 IF t.selection='fixed' AND (cardinality(t.question_ids)<>t.question_count OR (SELECT count(DISTINCT v) FROM unnest(t.question_ids) v)<>t.question_count) THEN RAISE EXCEPTION 'Liste fixe incomplète ou doublonnée.'; END IF;
 IF EXISTS(SELECT 1 FROM unnest(t.pathways) path WHERE (SELECT count(*) FROM public.learning_questions WHERE published AND path=ANY(pathways) AND (cardinality(t.themes)=0 OR theme=ANY(t.themes) OR exam_theme=ANY(t.themes)) AND (t.selection<>'fixed' OR id=ANY(t.question_ids)))<t.question_count) THEN RAISE EXCEPTION 'Nombre de questions publiées insuffisant pour un parcours.'; END IF;
 UPDATE public.learning_tests SET status='published',revision=revision+1,updated_at=now() WHERE id=t.id;
 ELSIF p_action='test_offline' THEN UPDATE public.learning_tests SET status='offline',revision=revision+1,updated_at=now() WHERE id=entity::uuid; END IF; SELECT to_jsonb(z) INTO result FROM public.learning_tests z WHERE id=entity::uuid;
ELSIF p_action='role_set' THEN
 IF p_data->>'role' NOT IN ('admin','editor','reviewer','operations') OR NOT EXISTS(SELECT 1 FROM public.profiles WHERE id=entity::uuid) THEN RAISE EXCEPTION 'Rôle ou compte invalide.'; END IF;
 PERFORM pg_advisory_xact_lock(763101); SELECT jsonb_agg(to_jsonb(r)) INTO old FROM public.user_roles r WHERE user_id=entity::uuid;
 IF coalesce((p_data->>'enabled')::boolean,false) THEN INSERT INTO public.user_roles(user_id,role) VALUES(entity::uuid,p_data->>'role') ON CONFLICT DO NOTHING;
 ELSE IF p_data->>'role'='admin' AND EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=entity::uuid AND role='admin') AND (SELECT count(*) FROM public.user_roles WHERE role='admin')<=1 THEN RAISE EXCEPTION 'Le dernier administrateur ne peut pas être retiré.'; END IF;DELETE FROM public.user_roles WHERE user_id=entity::uuid AND role=p_data->>'role'; END IF;SELECT jsonb_agg(to_jsonb(r)) INTO result FROM public.user_roles r WHERE user_id=entity::uuid;
ELSIF p_action LIKE 'translation_%' THEN
 SELECT to_jsonb(z) INTO old FROM public.admin_translations z WHERE question_id=entity AND locale=p_data->>'locale';
 IF p_action='translation_save' THEN SELECT * INTO q FROM public.question_drafts WHERE id=entity;PERFORM public.admin_validate_question(q.payload||jsonb_build_object('translations',jsonb_build_object(p_data->>'locale',p_data->'payload')));INSERT INTO public.admin_translations(question_id,locale,payload,source_revision) VALUES(entity,p_data->>'locale',p_data->'payload',q.revision) ON CONFLICT(question_id,locale) DO UPDATE SET payload=excluded.payload,source_revision=excluded.source_revision,status='pending',updated_at=now();
 ELSE UPDATE public.admin_translations SET status='reviewed',updated_at=now() WHERE question_id=entity AND locale=p_data->>'locale' AND source_revision=(SELECT revision FROM public.question_drafts WHERE id=entity);IF NOT FOUND THEN RAISE EXCEPTION 'Traduction absente ou source modifiée.'; END IF; END IF; SELECT to_jsonb(z) INTO result FROM public.admin_translations z WHERE question_id=entity AND locale=p_data->>'locale';
ELSIF p_action LIKE 'media_%' THEN
 IF p_action='media_save' THEN p:=p_data->'payload';IF coalesce(p->>'url','') !~ '^https://' THEN RAISE EXCEPTION 'Adresse HTTPS requise.'; END IF;entity:=coalesce(nullif(entity,''),gen_random_uuid()::text); SELECT to_jsonb(z) INTO old FROM public.admin_media z WHERE id=entity::uuid;INSERT INTO public.admin_media(id,title,url,lesson_id,kind,language,source,rights) VALUES(entity::uuid,p->>'title',p->>'url',nullif(p->>'lesson_id',''),p->>'kind',p->>'language',p->>'source',p->>'rights') ON CONFLICT(id) DO UPDATE SET title=excluded.title,url=excluded.url,lesson_id=excluded.lesson_id,kind=excluded.kind,language=excluded.language,source=excluded.source,rights=excluded.rights,verified=false,updated_at=now(); ELSE SELECT to_jsonb(z) INTO old FROM public.admin_media z WHERE id=entity::uuid;UPDATE public.admin_media SET verified=true,updated_at=now() WHERE id=entity::uuid AND source<>'' AND rights<>''; IF NOT FOUND THEN RAISE EXCEPTION 'Source et autorisation requises.'; END IF; END IF;SELECT to_jsonb(z) INTO result FROM public.admin_media z WHERE id=entity::uuid;
ELSIF p_action LIKE 'lesson_%' THEN
 SELECT to_jsonb(z) INTO old FROM public.lesson_drafts z WHERE id=entity FOR UPDATE;
 IF p_action='lesson_save' THEN p:=p_data->'payload';IF coalesce(p->>'title','')='' OR jsonb_typeof(p->'body') IS DISTINCT FROM 'array' OR jsonb_array_length(p->'body')=0 THEN RAISE EXCEPTION 'Titre et sections requis.'; END IF; INSERT INTO public.lesson_drafts(id,payload) VALUES(entity,p) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload,status='draft',revision=lesson_drafts.revision+1,updated_at=now(); ELSE SELECT payload INTO p FROM public.lesson_drafts WHERE id=entity;IF coalesce(p->>'source_url','') !~ '^https://' THEN RAISE EXCEPTION 'Source du cours requise.'; END IF;UPDATE public.learning_lessons SET title=p->>'title',topic=p->>'topic',body=ARRAY(SELECT jsonb_array_elements_text(p->'body')),takeaway=ARRAY(SELECT jsonb_array_elements_text(p->'takeaway')),minutes=(p->>'minutes')::integer,source_url=p->>'source_url',published=true WHERE id=entity;IF NOT FOUND THEN RAISE EXCEPTION 'Cours existant requis pour préserver l’ordre du parcours.'; END IF;UPDATE public.lesson_drafts SET status='published',revision=revision+1,updated_at=now() WHERE id=entity; END IF;SELECT to_jsonb(z) INTO result FROM public.lesson_drafts z WHERE id=entity;
ELSIF p_action='report_update' THEN SELECT to_jsonb(z) INTO old FROM public.question_reports z WHERE id=entity::uuid;UPDATE public.question_reports SET status=p_data->>'status',reply=coalesce(p_data->>'reply','') WHERE id=entity::uuid; SELECT to_jsonb(z) INTO result FROM public.question_reports z WHERE id=entity::uuid;
END IF;
INSERT INTO public.admin_audit(actor,action,entity_id,before_data,after_data) VALUES(auth.uid(),p_action,entity,old,result); RETURN coalesce(result,'{}'); END $function$;

-- Section 2: publishing a lesson carries the optional layout and the chosen hero media.
CREATE OR REPLACE FUNCTION public.manage_learning_lesson(p_action text, p_id text, p_payload jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$ DECLARE d public.lesson_drafts; old jsonb; result jsonb; pos integer; BEGIN
IF p_action NOT IN ('save','review','publish') OR NOT public.admin_can(CASE WHEN p_action='save' THEN 'edit' ELSE 'publish' END) THEN RAISE EXCEPTION 'Permission refusée.' USING ERRCODE='42501'; END IF;
IF p_id !~ '^[a-z0-9_-]{1,100}$' THEN RAISE EXCEPTION 'Identifiant de cours invalide.'; END IF;
PERFORM pg_advisory_xact_lock(763102); SELECT * INTO d FROM public.lesson_drafts WHERE id=p_id FOR UPDATE; old:=to_jsonb(d);
IF p_action='save' THEN
IF length(trim(coalesce(p_payload->>'title','')))<5 OR jsonb_typeof(p_payload->'body') IS DISTINCT FROM 'array' OR jsonb_array_length(p_payload->'body')<1 OR jsonb_typeof(p_payload->'takeaway') IS DISTINCT FROM 'array' OR jsonb_array_length(p_payload->'takeaway')<1 OR EXISTS(SELECT 1 FROM jsonb_array_elements_text(p_payload->'body') x WHERE length(trim(x))<20) OR coalesce(p_payload->>'topic','') NOT IN ('Principes et valeurs de la République française','Système institutionnel et politique','Droits et devoirs','Histoire, géographie et culture','Vivre dans la société française','Valeurs de la République','Institutions françaises') OR coalesce((p_payload->>'minutes')::integer,0) NOT BETWEEN 1 AND 120 THEN RAISE EXCEPTION 'Titre, thème, durée, sections et résumé requis.'; END IF;
INSERT INTO public.lesson_drafts(id,payload,status) VALUES(p_id,p_payload,'draft') ON CONFLICT(id) DO UPDATE SET payload=excluded.payload,status='draft',revision=lesson_drafts.revision+1,updated_at=now();
ELSIF p_action='review' THEN
IF d.id IS NULL OR d.status<>'draft' OR coalesce(d.payload->>'source_url','') !~ '^https://([A-Za-z0-9-]+\.)*(gouv\.fr|service-public\.fr|vie-publique\.fr|legifrance\.gouv\.fr|assemblee-nationale\.fr|senat\.fr|elysee\.fr|conseil-constitutionnel\.fr)(/|$)' OR jsonb_array_length(coalesce(d.payload->'takeaway','[]'))=0 THEN RAISE EXCEPTION 'Brouillon complet et source officielle requis pour la relecture.'; END IF;
UPDATE public.lesson_drafts SET status='verified',revision=revision+1,updated_at=now() WHERE id=p_id;
ELSE
IF d.id IS NULL OR d.status<>'verified' THEN RAISE EXCEPTION 'Une relecture humaine est requise avant publication.'; END IF;
SELECT coalesce(max(position),0)+1 INTO pos FROM public.learning_lessons;
INSERT INTO public.learning_lessons(id,title,topic,position,body,takeaway,minutes,source_url,published,layout,hero_media_id) VALUES(p_id,d.payload->>'title',d.payload->>'topic',pos,ARRAY(SELECT jsonb_array_elements_text(d.payload->'body')),ARRAY(SELECT jsonb_array_elements_text(d.payload->'takeaway')),(d.payload->>'minutes')::integer,d.payload->>'source_url',true,d.payload->'layout',nullif(d.payload->>'hero_media_id','')) ON CONFLICT(id) DO UPDATE SET title=excluded.title,topic=excluded.topic,body=excluded.body,takeaway=excluded.takeaway,minutes=excluded.minutes,source_url=excluded.source_url,published=true,layout=excluded.layout,hero_media_id=excluded.hero_media_id;
UPDATE public.lesson_drafts SET status='published',revision=revision+1,updated_at=now() WHERE id=p_id;
END IF;
SELECT to_jsonb(z) INTO result FROM public.lesson_drafts z WHERE id=p_id;
INSERT INTO public.admin_audit(actor,action,entity_id,before_data,after_data) VALUES(auth.uid(),'lesson_'||p_action,p_id,old,result); RETURN result; END $function$;