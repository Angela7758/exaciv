import {createFileRoute} from '@tanstack/react-router';
import {Lessons} from '@/components/learning/LearningPages';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/lecons')({head:()=>seo('Mes leçons','Apprenez les valeurs, institutions, droits et devoirs.'),component:Lessons});
