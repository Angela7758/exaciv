import {createServerFn} from '@tanstack/react-start';
import {z} from 'zod';
import {requireSupabaseAuth} from '@/integrations/supabase/auth-middleware';
import {can,type Draft,type TestConfig} from './schema';
import type {Json} from '@/integrations/supabase/types';
import {assertOverviewAccess,catalogueOverview,activeLearners,completedSimulations} from './overview';
import {sessionQuestion} from '@/lib/sessions';
export const adminAccess=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).handler(async({context})=>{const r=await context.supabase.from('user_roles').select('role').eq('user_id',context.userId);if(r.error)throw new Error('Permissions indisponibles.');return r.data.map(v=>v.role);});
export const adminData=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({section:z.enum(['overview','questions','imports','tests','lessons','translations','media','users','reports','audit']),days:z.number().int().min(1).max(30).default(7)})).handler(async({data,context})=>{
 const r=await context.supabase.from('user_roles').select('role').eq('user_id',context.userId);if(r.error||!r.data.length)throw new Error('Accès réservé à l’administration.');const roles=r.data.map(v=>v.role);
 const permission=data.section==='users'?'users':data.section==='reports'?'reports':data.section==='audit'?'audit':data.section==='overview'?'overview':'content';if(permission!=='overview'&&!can(roles,permission))throw new Error('Votre rôle ne permet pas cet accès.');
 const metrics=await context.supabase.rpc('admin_metrics',{p_days:data.days});if(metrics.error)throw new Error(metrics.error.message);
 let rows:Json[]=[];if(data.section==='users'){const u=await context.supabase.rpc('admin_users');if(u.error)throw new Error(u.error.message);rows=u.data as Json[];}
 else if(data.section!=='overview'){
 const table={questions:'question_drafts',imports:'admin_imports',tests:'learning_tests',lessons:'lesson_drafts',translations:'admin_translations',media:'admin_media',reports:'question_reports',audit:'admin_audit'}[data.section] as 'question_drafts'|'admin_imports'|'learning_tests'|'lesson_drafts'|'admin_translations'|'admin_media'|'question_reports'|'admin_audit';
 const result=await context.supabase.from(table).select('*').limit(1000);if(result.error)throw new Error(result.error.message);rows=result.data;
 if(data.section==='lessons'){const {supabaseAdmin:db}=await import('@/integrations/supabase/client.server');const live=await db.from('learning_lessons').select('id,published,title,topic,body,takeaway,minutes,source_url');const byId=new Map((live.data??[]).map(l=>[l.id,l]));rows=(result.data as {id:string}[]).map(r=>({...r,live:byId.get(r.id)??null})) as unknown as Json[];}
 }
 return {roles,metrics:metrics.data as Record<string,number|null>,rows};
});
export const adminQuestions=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).handler(async({context})=>{const p=await context.supabase.rpc('admin_can',{p_permission:'content'});if(!p.data)throw new Error('Accès refusé.');// Live rows include unpublished ones (RLS hides them), read only after the content permission check.
 const {supabaseAdmin:db}=await import('@/integrations/supabase/client.server');const [r,live]=await Promise.all([context.supabase.from('question_drafts').select('*').order('updated_at',{ascending:false}).limit(2000),db.from('learning_questions').select('id,published,question,options,option_ids,correct_option_id,explanation,theme,exam_theme,pathways,source,source_url,lesson_id,question_type,classification_source').limit(2000)]);if(r.error)throw new Error(r.error.message);const byId=new Map((live.data??[]).map(q=>[q.id,q]));return (r.data as unknown as Draft[]).map(d=>({...d,live:(byId.get(d.id)??null) as Draft['live']}));});
export const adminVersions=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({id:z.string()})).handler(async({context,data})=>{const p=await context.supabase.rpc('admin_can',{p_permission:'content'});if(!p.data)throw new Error('Accès refusé.');const r=await context.supabase.from('question_versions').select('*').eq('question_id',data.id).order('revision',{ascending:false});if(r.error)throw new Error(r.error.message);return r.data;});
export const adminCommand=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({action:z.string().max(50),payload:z.record(z.unknown())})).handler(async({context,data})=>{const r=data.action.startsWith('lesson_')?await context.supabase.rpc('manage_learning_lesson',{p_action:data.action.slice(7),p_id:String(data.payload['id']),p_payload:(data.payload['payload']??{}) as Json}):await context.supabase.rpc('admin_command',{p_action:data.action,p_data:data.payload as Json});if(r.error)throw new Error(r.error.message);return r.data;});
export const availableTests=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).handler(async({context})=>{const p=await context.supabase.from('profiles').select('parcours').eq('id',context.userId).single();if(p.error)throw new Error('Profil indisponible.');const r=await context.supabase.from('learning_tests').select('*').eq('status','published').contains('pathways',[p.data.parcours]);if(r.error)throw new Error('Tests indisponibles.');return r.data as TestConfig[];});
export const startConfiguredTest=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({id:z.string().uuid()})).handler(async({context,data})=>{const r=await context.supabase.rpc('start_configured_test',{p_test:data.id});if(r.error)throw new Error(r.error.message);const s=await context.supabase.from('learning_sessions').select('kind').eq('id',r.data).single();if(s.error)throw new Error('Session indisponible.');return {id:r.data,kind:s.data.kind};});
export const submitQuestionReport=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({questionId:z.string().min(1),reason:z.string().trim().min(5).max(2000)})).handler(async({context,data})=>{const r=await context.supabase.from('question_reports').insert({question_id:data.questionId,reason:data.reason,user_id:context.userId});if(r.error)throw new Error('Signalement non enregistré.');return {success:true};});

export const adminOverviewData=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({days:z.union([z.literal(7),z.literal(30),z.literal(90)])})).handler(async({context,data})=>{
 const access=await context.supabase.from('user_roles').select('role').eq('user_id',context.userId);
 if(access.error)throw new Error('Permissions indisponibles.');
 const roles=access.data.map(r=>r.role);assertOverviewAccess(roles);
 // Cross-account aggregation is privileged, after the unchanged role boundary.
 const {supabaseAdmin:db}=await import('@/integrations/supabase/client.server');
 const since=new Date(Date.now()-data.days*86400000).toISOString();
 const [accounts,questions,lessons,reports]=await Promise.all([
  db.from('profiles').select('id',{count:'exact',head:true}).gte('created_at',since),
  db.from('learning_questions').select('theme,exam_theme,pathways,question_type,classification_reviewed_at').eq('published',true),
  db.from('learning_lessons').select('topic').eq('published',true),
  db.from('question_reports').select('id',{count:'exact',head:true}).eq('status','open')
 ]);
 if(accounts.error||questions.error||lessons.error||reports.error)throw new Error('Indicateurs indisponibles.');
 // Page through activity rows: totals must not silently stop at the Data API cap.
 const sessions=[];const completions=[];
 for(let offset=0;;offset+=1000){const r=await db.from('learning_sessions').select('user_id').gte('started_at',since).range(offset,offset+999);if(r.error)throw new Error('Activité indisponible.');sessions.push(...r.data);if(r.data.length<1000)break;}
 for(let offset=0;;offset+=1000){const r=await db.from('learning_completions').select('user_id').gte('completed_at',since).range(offset,offset+999);if(r.error)throw new Error('Activité indisponible.');completions.push(...r.data);if(r.data.length<1000)break;}
 const exams=[];
 for(let offset=0;;offset+=1000){const r=await db.from('learning_sessions').select('total,questions,answers').eq('kind','exam').eq('total',40).gte('completed_at',since).range(offset,offset+999);if(r.error)throw new Error('Simulations indisponibles.');exams.push(...r.data.map(s=>({total:s.total,questions:z.array(sessionQuestion).parse(s.questions),answers:z.record(z.number()).parse(s.answers)})));if(r.data.length<1000)break;}
 const audit=can(roles,'audit')?await context.supabase.from('admin_audit').select('id,actor,action,created_at').gte('created_at',since).order('created_at',{ascending:false}).limit(10):null;
 if(audit?.error)throw new Error('Journal indisponible.');
 return {roles,days:data.days,accounts:accounts.count,active:activeLearners(sessions,completions),completed:completedSimulations(exams),reports:reports.count,...catalogueOverview(questions.data,lessons.data),operations:audit?.data??null};
});
