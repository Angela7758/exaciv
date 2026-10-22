import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { Database } from '@/integrations/supabase/types';
import {officialTopic} from '@/config/official-programme';
import {PRACTICE_THEMES} from '@/lib/practice-entry';
export const getCatalogue = createServerFn({method:'GET'}).handler(async()=>{
 const key=process.env['SUPABASE_PUBLISHABLE_KEY']; const url=process.env['SUPABASE_URL'];
 if(!key || !url) throw new Error('Catalogue indisponible');
 const db=createClient<Database>(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>{ const h=new Headers(init?.headers); if(key.startsWith('sb_') && h.get('Authorization')===`Bearer ${key}`) h.delete('Authorization'); h.set('apikey',key); return fetch(input,{...init,headers:h}); }}});
 const [q,l]=await Promise.all([db.from('learning_questions').select('*').eq('published',true).order('position'),db.from('learning_lessons').select('*').eq('published',true).order('position')]);
 if(q.error || l.error) throw new Error('Impossible de charger les contenus.');
 const counts=new Map<string,number>();q.data.forEach(v=>{if(v.exam_theme)counts.set(v.exam_theme,(counts.get(v.exam_theme)??0)+1);});
 return {questions:q.data.slice(0,10),lessons:l.data.map(lesson=>({...lesson,topic:officialTopic(lesson.topic)})),practiceCounts:Object.fromEntries(PRACTICE_THEMES.map(t=>[t.title,q.data.filter(v=>(t.themes as readonly string[]).includes(v.theme)||(t.themes as readonly string[]).includes(v.exam_theme??'')).length])),examAvailable:['Institutions','Valeurs de la République','Histoire','Droits et devoirs','France et Europe'].every(t=>(counts.get(t)??0)>=8)};
});
export const getLearning = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const [p,c,a,s]=await Promise.all([context.supabase.from('profiles').select('*').eq('id',context.userId).single(),context.supabase.from('learning_completions').select('*').eq('user_id',context.userId),context.supabase.from('learning_attempts').select('*').eq('user_id',context.userId).order('created_at',{ascending:false}).limit(30),context.supabase.from('learning_sessions').select('id,correct,total,completed_at,started_at,kind,parcours').eq('user_id',context.userId).not('completed_at','is',null).order('started_at',{ascending:false}).limit(50)]);
 if(p.error || c.error || a.error || s.error) throw new Error('Impossible de charger votre progression.');
 return {profile:p.data,completions:c.data.filter(v=>v.parcours===p.data.parcours),attempts:a.data.filter(v=>v.parcours===p.data.parcours),sessions:s.data.filter(v=>v.parcours===p.data.parcours)};
});
export const completeLesson = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({lessonId:z.string()})).handler(async({data,context})=>{const r=await context.supabase.rpc('complete_learning_lesson',{p_lesson:data.lessonId});if(r.error)throw new Error(r.error.message);return {success:true};});
export const saveAttempt = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({answers:z.array(z.number().int().min(0).max(3).nullable()).length(10)})).handler(async({data,context})=>{const r=await context.supabase.rpc('record_learning_attempt',{p_answers:data.answers});if(r.error)throw new Error(r.error.message);return r.data;});
export const updateProfile = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({display_name:z.string().max(80),avatar_url:z.string().url().or(z.literal('')),locale:z.enum(['fr','zh','en','ar','es','ru']),parcours:z.enum(['naturalisation','resident','sejour']),goal_date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable()})).handler(async({data,context})=>{const r=await context.supabase.from('profiles').update(data).eq('id',context.userId);if(r.error)throw new Error(r.error.message);return {success:true};});
