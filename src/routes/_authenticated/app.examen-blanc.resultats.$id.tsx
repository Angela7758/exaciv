import {createFileRoute} from '@tanstack/react-router';
import {SessionResults} from '@/components/learning/SessionResults';
import {sessionOptions} from '@/lib/session.queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/examen-blanc/resultats/$id')({loader:({context,params})=>context.queryClient.ensureQueryData(sessionOptions(params.id)),head:()=>seo('Résultats de votre examen blanc','Consultez votre score ExaCiv et révisez les erreurs de cet entraînement non officiel.'),component:()=> <SessionResults id={Route.useParams().id}/>,errorComponent:()=> <p role="alert">Résultats indisponibles. Vérifiez votre connexion puis réessayez.</p>,notFoundComponent:()=> <p>Examen introuvable.</p>});
