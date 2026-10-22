import {createServerFn} from '@tanstack/react-start';
import {requireSupabaseAuth} from '@/integrations/supabase/auth-middleware';
import {revisionPlanSchema} from './revision-plan';
export const getLatestRevisionPlan=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const {data,error}=await context.supabase.from('revision_plans').select('plan,created_at').eq('user_id',context.userId).order('created_at',{ascending:false}).limit(1).maybeSingle();
 if(error)throw new Error('Plan indisponible.');
 if(!data)return null;
 const parsed=revisionPlanSchema.safeParse(data.plan);
 return parsed.success?{plan:parsed.data,createdAt:data.created_at}:null;
});