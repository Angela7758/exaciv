import {createFileRoute} from '@tanstack/react-router';
import {AuthForm} from '@/components/learning/AuthForm';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/connexion')({head:()=>seo('Se connecter','Connectez-vous à votre compte ExaCiv.'),component:()=> <AuthForm mode="login"/>});
