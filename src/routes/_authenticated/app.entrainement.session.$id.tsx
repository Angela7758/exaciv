import {FlowError,FlowNotFound} from '@/components/learning/FlowStates';
import {createFileRoute} from '@tanstack/react-router';
import {PracticeSession} from '@/components/learning/PracticeSession';
import {sessionOptions} from '@/lib/session.queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/entrainement/session/$id')({errorComponent:FlowError,notFoundComponent:FlowNotFound,validateSearch:(s:Record<string,unknown>):{demo?:boolean;correction?:'fin';chrono?:boolean}=>({demo:s['demo']===true||s['demo']==='true',...(s['correction']==='fin'?{correction:'fin' as const}:{}),...(s['chrono']===true||s['chrono']==='true'?{chrono:true}:{})}),loaderDeps:({search})=>({demo:search.demo}),loader:({context,params,deps})=>{if(deps.demo)return;return context.queryClient.ensureQueryData(sessionOptions(params.id));},head:()=>seo('Question d’entraînement','Entraînez-vous à votre rythme et conservez vos réponses ExaCiv.'),component:()=>{const {demo,correction,chrono}=Route.useSearch();return <PracticeSession id={Route.useParams().id} demo={demo??false} correction={correction} chrono={chrono}/>;}});
