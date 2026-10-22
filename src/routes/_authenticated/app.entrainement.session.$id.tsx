import {createFileRoute} from '@tanstack/react-router';
import {PracticeSession} from '@/components/learning/PracticeSession';
import {sessionOptions} from '@/lib/session.queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/entrainement/session/$id')({validateSearch:(s:Record<string,unknown>)=>({demo:s['demo']===true||s['demo']==='true'}),loader:({context,params,location})=>{if(location.search.demo)return;return context.queryClient.ensureQueryData(sessionOptions(params.id));},head:()=>seo('Question d’entraînement','Entraînez-vous à votre rythme et conservez vos réponses ExaCiv.'),component:()=> <PracticeSession id={Route.useParams().id} demo={Route.useSearch().demo}/>});