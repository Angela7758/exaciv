import {createFileRoute} from '@tanstack/react-router';
import {SessionFeedback} from '@/components/learning/SessionFeedback';
import {sessionOptions} from '@/lib/session.queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/entrainement/$sessionId/feedback')({loader:({context,params})=>context.queryClient.ensureQueryData(sessionOptions(params.sessionId)),head:()=>seo('Réponse et correction','Comprenez vos réponses et poursuivez votre entraînement ExaCiv.'),component:()=>{const {sessionId}=Route.useParams();return <SessionFeedback id={sessionId}/>;}});
