import {FlowError,FlowNotFound} from '@/components/learning/FlowStates';
import {createFileRoute} from '@tanstack/react-router';
import {AppShell} from '@/components/learning/AppShell';
import {catalogueOptions,learningOptions} from '@/lib/learning.queries';
export const Route=createFileRoute('/_authenticated/app')({errorComponent:FlowError,notFoundComponent:FlowNotFound,loader:async({context})=>{await Promise.all([context.queryClient.ensureQueryData(catalogueOptions),context.queryClient.ensureQueryData(learningOptions)]);},component:AppShell,pendingComponent:()=> <p className="p-10">Chargement de votre espace…</p>});
