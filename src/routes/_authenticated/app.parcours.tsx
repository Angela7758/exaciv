import {createFileRoute} from '@tanstack/react-router';
import {LearningMap} from '@/components/learning/LearningMap';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/parcours')({head:()=>seo('Votre parcours civique','Avancez étape par étape dans votre préparation.'),component:LearningMap});
