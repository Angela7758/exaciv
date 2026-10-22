import {createFileRoute} from '@tanstack/react-router';
import {WelcomePreparation} from '@/components/learning/WelcomePreparation';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/bienvenue')({head:()=>seo('Votre parcours est prêt','Retrouvez votre objectif et commencez votre préparation ExaCiv.'),component:WelcomePreparation});