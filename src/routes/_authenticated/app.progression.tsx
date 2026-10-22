import {createFileRoute} from '@tanstack/react-router';
import {LearningOverview} from '@/components/learning/LearningPages';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/progression')({head:()=>seo('Progression','Votre espace personnel de préparation ExaCiv.'),component:()=> <LearningOverview view="progression"/>});
