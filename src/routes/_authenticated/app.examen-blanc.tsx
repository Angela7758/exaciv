import {createFileRoute} from '@tanstack/react-router';
import {SessionStart} from '@/components/learning/SessionStart';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/examen-blanc')({head:()=>seo('Examen-blanc','Votre espace personnel de préparation ExaCiv.'),component:()=> <SessionStart exam/>});
