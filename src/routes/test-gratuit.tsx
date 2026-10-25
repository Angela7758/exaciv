import {FlowError,FlowNotFound} from '@/components/learning/FlowStates';
import {createFileRoute} from '@tanstack/react-router';
import {Quiz} from '@/components/learning/Quiz';
import {freeCatalogueOptions} from '@/lib/learning.queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/test-gratuit')({errorComponent:FlowError,notFoundComponent:FlowNotFound,head:()=>seo('Test gratuit','Dix questions d’entraînement sans compte, avec corrections et résultat immédiat.'),loader:({context})=>context.queryClient.ensureQueryData(freeCatalogueOptions),component:Quiz,pendingComponent:()=> <p className="p-10">Chargement du test…</p>});
