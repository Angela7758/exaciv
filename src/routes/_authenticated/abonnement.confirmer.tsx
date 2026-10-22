import {createFileRoute,Outlet} from '@tanstack/react-router';
import {createRoute} from '@tanstack/react-router';
import {AppShell} from '@/components/learning/AppShell';
import {SubscriptionConfirmation} from '@/components/learning/SubscriptionConfirmation';
import {catalogueOptions,learningOptions} from '@/lib/learning.queries';
import {selectedPlan} from '@/lib/preparation-navigation';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/abonnement/confirmer')({validateSearch:(s:Record<string,unknown>)=>({plan:selectedPlan(s['plan'])}),loader:async({context})=>{await Promise.all([context.queryClient.ensureQueryData(learningOptions),context.queryClient.ensureQueryData(catalogueOptions)]);},head:()=>seo('Confirmer votre formule','Vérifiez la formule et le prix choisis avant tout paiement.'),component:Page,errorComponent:()=> <p role="alert">Votre formule n’a pas pu être chargée. Réessayez depuis les abonnements.</p>,notFoundComponent:()=> <p>Formule introuvable.</p>});
function Page(){const {plan}=Route.useSearch();return <AppShell content={<SubscriptionConfirmation planId={plan}/>}/>;}