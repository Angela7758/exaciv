import {createFileRoute} from '@tanstack/react-router';
import {Quiz} from '@/components/learning/Quiz';
import {catalogueOptions} from '@/lib/learning.queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/test-gratuit')({head:()=>seo('Test gratuit','Dix questions d’entraînement sans compte, avec corrections et résultat immédiat.'),loader:({context})=>context.queryClient.ensureQueryData(catalogueOptions),component:Quiz,pendingComponent:()=> <p className="p-10">Chargement du test…</p>});
