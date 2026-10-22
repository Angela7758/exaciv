import {createFileRoute} from '@tanstack/react-router';
import {AuthForm} from '@/components/learning/AuthForm';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/mot-de-passe-oublie')({head:()=>seo('Mot de passe oublié','Recevez un lien pour réinitialiser votre mot de passe.'),component:()=> <AuthForm mode="forgot"/>});
