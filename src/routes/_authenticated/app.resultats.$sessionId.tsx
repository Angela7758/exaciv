import {FlowError,FlowNotFound} from '@/components/learning/FlowStates';
import {createFileRoute} from '@tanstack/react-router';
import {SessionResults,AnswerReview} from '@/components/learning/SessionResults';
import {sessionOptions} from '@/lib/session.queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/resultats/$sessionId')({errorComponent:FlowError,notFoundComponent:FlowNotFound,validateSearch:(s:Record<string,unknown>):{review?:boolean}=>s['review']===true||s['review']==='true'?{review:true}:{},loader:({context,params})=>context.queryClient.ensureQueryData(sessionOptions(params.sessionId)),head:()=>seo('Résultats de session','Vos résultats d’entraînement ExaCiv et les thèmes à renforcer, sans valeur officielle.'),component:()=>{const {sessionId}=Route.useParams();const {review}=Route.useSearch();return <><SessionResults id={sessionId}/>{review&&<AnswerReview id={sessionId}/>}</>;}});
