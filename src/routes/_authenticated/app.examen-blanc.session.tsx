import {FlowError,FlowNotFound} from '@/components/learning/FlowStates';
import {createFileRoute} from '@tanstack/react-router';
import {MockExamSession} from '@/components/learning/MockExamSession';
import {sessionsOptions} from '@/lib/session.queries';
import {learningOptions} from '@/lib/learning.queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/examen-blanc/session')({errorComponent:FlowError,notFoundComponent:FlowNotFound,validateSearch:(s:Record<string,unknown>):{session?:string;demo?:boolean}=>({...typeof s['session']==='string'?{session:s['session']}:{},...s['demo']===true||s['demo']==='true'?{demo:true}:{}}),loader:async({context})=>{await Promise.all([context.queryClient.ensureQueryData(sessionsOptions),context.queryClient.ensureQueryData(learningOptions)]);},head:()=>seo('Examen blanc en cours','Votre session chronométrée d’entraînement ExaCiv, sans valeur officielle.'),component:()=>{const {session,demo}=Route.useSearch();return <MockExamSession id={session} demo={demo??false}/>;}});