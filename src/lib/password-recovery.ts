import {supabase} from '@/integrations/supabase/client';
let recovery=false;
let initialization:Promise<boolean>|undefined;
export function markPasswordRecovery(){recovery=true;}
export function consumePasswordRecovery(){recovery=false;initialization=undefined;}
export function validateNewPassword(password:string,confirmation:string){return {password:password.length<8?'Utilisez au moins 8 caractères.':'',confirmation:password!==confirmation?'Les deux mots de passe ne correspondent pas.':''};}
export function initializePasswordRecovery(){
 if(initialization)return initialization;
 initialization=(async()=>{const url=new URL(window.location.href);const fragment=new URLSearchParams(url.hash.slice(1));if(url.searchParams.has('error')||fragment.has('error'))return false;const hash=url.searchParams.get('token_hash');const code=url.searchParams.get('code');
 if(hash&&url.searchParams.get('type')==='recovery'){const r=await supabase.auth.verifyOtp({token_hash:hash,type:'recovery'});if(r.error||!r.data.session)return false;recovery=true;}
 else if(code){const r=await supabase.auth.exchangeCodeForSession(code);if(r.error)return false;}
 else await supabase.auth.getSession();
 // Only the provider's PASSWORD_RECOVERY event or verified recovery OTP grants access.
 if(!recovery)return false;const r=await supabase.auth.getUser();if(r.error||!r.data.user)return false;window.history.replaceState(window.history.state,'',url.pathname);return true;})().catch(()=>false);return initialization;
}
