import {createServerFn} from '@tanstack/react-start';
import {z} from 'zod';
import {requireSupabaseAuth} from '@/integrations/supabase/auth-middleware';
import {accountSettingsSchema} from './account-settings';

const helpPreferenceSchema=z.object({
  translation_help:z.boolean().optional(),
  help_locale:z.enum(['zh','en','ar','es','ru','pt']).optional(),
});
export const saveHelpPreference=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(helpPreferenceSchema).handler(async({data,context})=>{
  const update:{translation_help?:boolean;help_locale?:string}={};
  if(data.translation_help!==undefined)update.translation_help=data.translation_help;
  if(data['help_locale']!==undefined)update.help_locale=data['help_locale'];
  if(Object.keys(update).length===0)return {success:true};
  const r=await context.supabase.from('profiles').update(update).eq('id',context.userId);
  if(r.error)throw new Error('Votre préférence n’a pas été enregistrée.');
  return {success:true};
});
export const saveAccountSettings=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(accountSettingsSchema).handler(async({data,context})=>{const r=await context.supabase.from('profiles').update(data).eq('id',context.userId);if(r.error)throw new Error('Vos réglages n’ont pas été enregistrés.');return {success:true};});
export const getAccountEmail=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).handler(async({context})=>{const r=await context.supabase.auth.getUser();if(r.error)throw new Error('Compte indisponible.');return r.data.user.email??'';});