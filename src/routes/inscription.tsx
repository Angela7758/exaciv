import {createFileRoute} from '@tanstack/react-router';
import {AuthForm} from '@/components/learning/AuthForm';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/inscription')({head:()=>seo('Créer un compte','Créez votre compte pour retrouver vos progrès.'),component:()=> <AuthForm mode="signup"/>});
