import {FlowError,FlowNotFound} from '@/components/learning/FlowStates';
import {createFileRoute} from '@tanstack/react-router';
import {AppShell} from '@/components/learning/AppShell';
import {catalogueOptions,learningOptions,reviewLearningOptions} from '@/lib/learning.queries';
export const Route=createFileRoute('/_authenticated/app')({errorComponent:FlowError,notFoundComponent:FlowNotFound,loader:async({context,location})=>{await Promise.all([context.queryClient.ensureQueryData(catalogueOptions),context.queryClient.ensureQueryData(location.pathname.endsWith("/mes-erreurs/reviser")?reviewLearningOptions:learningOptions)]);},component:AppShell,pendingComponent:()=> <p className="p-10">Chargement de votre espace…</p>});
