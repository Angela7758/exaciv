import {createServerFn} from '@tanstack/react-start';
import {z} from 'zod';
import {requireSupabaseAuth} from '@/integrations/supabase/auth-middleware';
import {agendaSchema} from './agenda';
export const saveAgenda=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(agendaSchema).handler(async({data,context})=>{
 const {id,...values}=data;
 const r=id?await context.supabase.from('learning_agenda').update({...values,updated_at:new Date().toISOString()}).eq('id',id).eq('user_id',context.userId).select().single():await context.supabase.from('learning_agenda').insert({...values,user_id:context.userId}).select().single();
 if(r.error)throw new Error('Votre tâche n’a pas été enregistrée.');return r.data;
});
export const deleteAgenda=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({id:z.string().uuid()})).handler(async({data,context})=>{const r=await context.supabase.from('learning_agenda').delete().eq('id',data.id).eq('user_id',context.userId).select('id').single();if(r.error)throw new Error('La tâche n’a pas été supprimée.');return {success:true};});