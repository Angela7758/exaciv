import {createFileRoute} from '@tanstack/react-router';
import {SessionStart} from '@/components/learning/SessionStart';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/examen-blanc/')({validateSearch:(s:Record<string,unknown>):{demo?:boolean}=>s['demo']===true||s['demo']==='true'?{demo:true}:{},head:()=>seo('Examen blanc','Préparez votre entraînement ExaCiv de 40 questions en 45 minutes ; le chronomètre démarre au lancement.'),component:()=> <SessionStart exam demo={Route.useSearch().demo??false}/>});