import {createFileRoute} from '@tanstack/react-router';
import {MistakeLibrary} from '@/components/learning/MistakeLibrary';
import {sessionsOptions} from '@/lib/session.queries';
import {learningOptions} from '@/lib/learning.queries';
import {masteryOptions} from '@/lib/review.queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/mes-erreurs')({validateSearch:(s:Record<string,unknown>):{demo?:boolean}=>s['demo']===true||s['demo']==='true'?{demo:true}:{},loader:async({context})=>{await Promise.all([context.queryClient.ensureQueryData(sessionsOptions),context.queryClient.ensureQueryData(learningOptions),context.queryClient.ensureQueryData(masteryOptions)]);},head:()=>seo('Mes erreurs à réviser','Retrouvez vos réponses, leurs corrections et vos révisions ciblées ExaCiv.'),component:()=>{const {demo}=Route.useSearch();return <MistakeLibrary demo={demo??false}/>;}});