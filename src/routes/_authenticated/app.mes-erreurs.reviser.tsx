import {createFileRoute} from '@tanstack/react-router';
import {MistakeReview} from '@/components/learning/MistakeReview';
import {reviewQuestionsOptions} from '@/lib/review.queries';
import {seo} from '@/lib/seo';
import {FlowError,FlowNotFound} from '@/components/learning/FlowStates';
export const Route=createFileRoute('/_authenticated/app/mes-erreurs/reviser')({validateSearch:(s:Record<string,unknown>):{question?:string}=>typeof s['question']==='string'?{question:s['question']}:{},loaderDeps:({search})=>search,loader:({context,deps})=>context.queryClient.ensureQueryData(reviewQuestionsOptions(deps.question)),head:()=>seo('Réviser mes erreurs','Répondez à vos erreurs enregistrées et consultez la correction après validation dans ExaCiv.'),errorComponent:FlowError,notFoundComponent:FlowNotFound,component:Page});
function Page(){const {question}=Route.useSearch();return <MistakeReview {...(question?{question}:{})}/>;}