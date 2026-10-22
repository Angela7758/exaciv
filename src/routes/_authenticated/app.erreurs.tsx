import {createFileRoute} from '@tanstack/react-router';
import {LearningOverview} from '@/components/learning/LearningPages';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/erreurs')({head:()=>seo('Erreurs','Votre espace personnel de préparation ExaCiv.'),component:()=> <LearningOverview view="erreurs"/>});
