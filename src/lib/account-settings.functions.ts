import {createServerFn} from '@tanstack/react-start';
import {requireSupabaseAuth} from '@/integrations/supabase/auth-middleware';
import {accountSettingsSchema} from './account-settings';
export const saveAccountSettings=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(accountSettingsSchema).handler(async({data,context})=>{const r=await context.supabase.from('profiles').update(data).eq('id',context.userId);if(r.error)throw new Error('Vos réglages n’ont pas été enregistrés.');return {success:true};});
export const getAccountEmail=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).handler(async({context})=>{const r=await context.supabase.auth.getUser();if(r.error)throw new Error('Compte indisponible.');return r.data.user.email??'';});