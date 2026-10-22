import {createFileRoute} from '@tanstack/react-router';
import {SessionStart} from '@/components/learning/SessionStart';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/entrainement/')({head:()=>seo('Entraînement','Répondez aux questions et enregistrez votre résultat.'),component:()=> <SessionStart/>});
