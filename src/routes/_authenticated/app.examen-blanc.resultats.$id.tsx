import {createFileRoute} from '@tanstack/react-router';
import {SessionResults,AnswerReview} from '@/components/learning/SessionResults';
import {sessionOptions} from '@/lib/session.queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/examen-blanc/resultats/$id')({validateSearch:(s:Record<string,unknown>)=>({review:s['review']===true||s['review']==='true'}),loader:({context,params})=>context.queryClient.ensureQueryData(sessionOptions(params.id)),head:()=>seo('Résultats de votre examen blanc','Consultez votre score ExaCiv et révisez les erreurs de cet entraînement non officiel.'),component:Page,errorComponent:()=> <p role="alert">Résultats indisponibles. Vérifiez votre connexion puis réessayez.</p>,notFoundComponent:()=> <p>Examen introuvable.</p>});
function Page(){const {id}=Route.useParams();const {review}=Route.useSearch();return <><SessionResults id={id}/>{review&&<section id="exam-corrections"><AnswerReview id={id}/></section>}</>;}
