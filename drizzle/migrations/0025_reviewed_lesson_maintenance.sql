CREATE FUNCTION public.manage_learning_lesson(p_action text,p_id text,p_payload jsonb DEFAULT '{}'::jsonb) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE d public.lesson_drafts; old jsonb; result jsonb; pos integer; BEGIN
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
INSERT INTO public.learning_lessons(id,title,topic,position,body,takeaway,minutes,source_url,published) VALUES(p_id,d.payload->>'title',d.payload->>'topic',pos,ARRAY(SELECT jsonb_array_elements_text(d.payload->'body')),ARRAY(SELECT jsonb_array_elements_text(d.payload->'takeaway')),(d.payload->>'minutes')::integer,d.payload->>'source_url',true) ON CONFLICT(id) DO UPDATE SET title=excluded.title,topic=excluded.topic,body=excluded.body,takeaway=excluded.takeaway,minutes=excluded.minutes,source_url=excluded.source_url,published=true;
UPDATE public.lesson_drafts SET status='published',revision=revision+1,updated_at=now() WHERE id=p_id;
END IF;
SELECT to_jsonb(z) INTO result FROM public.lesson_drafts z WHERE id=p_id;
INSERT INTO public.admin_audit(actor,action,entity_id,before_data,after_data) VALUES(auth.uid(),'lesson_'||p_action,p_id,old,result); RETURN result; END $$;
REVOKE ALL ON FUNCTION public.manage_learning_lesson(text,text,jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.manage_learning_lesson(text,text,jsonb) TO authenticated;