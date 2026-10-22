import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { Database } from '@/integrations/supabase/types';
export const getCatalogue = createServerFn({method:'GET'}).handler(async()=>{
 const key=process.env['SUPABASE_PUBLISHABLE_KEY']; const url=process.env['SUPABASE_URL'];
 if(!key || !url) throw new Error('Catalogue indisponible');
 const db=createClient<Database>(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>{ const h=new Headers(init?.headers); if(key.startsWith('sb_') && h.get('Authorization')===`Bearer ${key}`) h.delete('Authorization'); h.set('apikey',key); return fetch(input,{...init,headers:h}); }}});
 const [q,l]=await Promise.all([db.from('learning_questions').select('*').eq('published',true).order('position'),db.from('learning_lessons').select('*').eq('published',true).order('position')]);
 if(q.error || l.error) throw new Error('Impossible de charger les contenus.');
 return {questions:q.data,lessons:l.data};
});
export const getLearning = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const [p,c,a]=await Promise.all([context.supabase.from('profiles').select('*').eq('id',context.userId).single(),context.supabase.from('learning_completions').select('*').eq('user_id',context.userId),context.supabase.from('learning_attempts').select('*').eq('user_id',context.userId).order('created_at',{ascending:false}).limit(30)]);
 if(p.error || c.error || a.error) throw new Error('Impossible de charger votre progression.');
 return {profile:p.data,completions:c.data.filter(v=>v.parcours===p.data.parcours),attempts:a.data.filter(v=>v.parcours===p.data.parcours)};
});
export const completeLesson = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({lessonId:z.string()})).handler(async({data,context})=>{const r=await context.supabase.rpc('complete_learning_lesson',{p_lesson:data.lessonId});if(r.error)throw new Error(r.error.message);return {success:true};});
export const saveAttempt = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({answers:z.array(z.number().int().min(0).max(3).nullable()).length(10)})).handler(async({data,context})=>{const r=await context.supabase.rpc('record_learning_attempt',{p_answers:data.answers});if(r.error)throw new Error(r.error.message);return r.data;});
export const updateProfile = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({display_name:z.string().max(80),avatar_url:z.string().url().or(z.literal('')),locale:z.enum(['fr','zh','en','ar','es','ru']),parcours:z.enum(['naturalisation','resident','sejour']),goal_date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable()})).handler(async({data,context})=>{const r=await context.supabase.from('profiles').update(data).eq('id',context.userId);if(r.error)throw new Error(r.error.message);return {success:true};});
