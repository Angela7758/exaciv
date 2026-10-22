import {createFileRoute} from '@tanstack/react-router';
import {LearningOverview} from '@/components/learning/LearningPages';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/abonnement')({head:()=>seo('Abonnement','Votre espace personnel de préparation ExaCiv.'),component:()=> <LearningOverview view="abonnement"/>});
