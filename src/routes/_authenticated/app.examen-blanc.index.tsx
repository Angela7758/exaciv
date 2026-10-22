import {createFileRoute} from '@tanstack/react-router';
import {SessionStart} from '@/components/learning/SessionStart';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/examen-blanc/')({head:()=>seo('Préparer un examen blanc','Lancez ou reprenez votre entraînement ExaCiv de 40 questions.'),component:()=> <SessionStart exam/>});