import {FlowError,FlowNotFound} from '@/components/learning/FlowStates';
import {createFileRoute} from '@tanstack/react-router';
import {LessonDetail} from '@/components/learning/LessonDetail';
import {catalogueOptions,learningOptions} from '@/lib/learning.queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/lecons/$slug')({errorComponent:FlowError,notFoundComponent:FlowNotFound,loader:async({context})=>{await Promise.all([context.queryClient.ensureQueryData(catalogueOptions),context.queryClient.ensureQueryData(learningOptions)]);},head:()=>seo('Détail de leçon','Comprenez les principes de la République avec les leçons ExaCiv.'),component:()=>{const {slug}=Route.useParams();return <LessonDetail slug={slug}/>;}});
