import {createFileRoute} from '@tanstack/react-router';
import {AuthForm} from '@/components/learning/AuthForm';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/auth')({head:()=>seo('Connexion à votre espace','Accédez à votre préparation personnelle ExaCiv.'),component:AuthForm});
