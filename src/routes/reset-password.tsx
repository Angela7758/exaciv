import {createFileRoute} from '@tanstack/react-router';
import {AuthForm} from '@/components/learning/AuthForm';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/reset-password')({head:()=>seo('Réinitialiser le mot de passe','Choisissez un nouveau mot de passe pour votre compte ExaCiv.'),component:()=> <AuthForm mode="reset"/>});
