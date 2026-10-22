import {createFileRoute} from '@tanstack/react-router';
import {Profile} from '@/components/learning/LearningPages';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/profil')({head:()=>seo('Mon profil','Personnalisez votre parcours et votre objectif.'),component:Profile});
