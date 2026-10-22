import {createFileRoute} from '@tanstack/react-router';
import {Quiz} from '@/components/learning/Quiz';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/entrainement')({head:()=>seo('Entraînement','Répondez aux questions et enregistrez votre résultat.'),component:()=> <Quiz practice/>});
