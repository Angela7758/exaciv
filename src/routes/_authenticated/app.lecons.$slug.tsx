import {FlowError,FlowNotFound} from '@/components/learning/FlowStates';
import {createFileRoute} from '@tanstack/react-router';
import {LessonDetail} from '@/components/learning/LessonDetail';
import {catalogueOptions,learningOptions} from '@/lib/learning.queries';
import {bookmarksOptions} from '@/lib/bookmarks.queries';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/lecons/$slug')({errorComponent:FlowError,notFoundComponent:FlowNotFound,loader:async({context,params})=>{const [c]=await Promise.all([context.queryClient.ensureQueryData(catalogueOptions),context.queryClient.ensureQueryData(learningOptions),context.queryClient.ensureQueryData(bookmarksOptions)]);return {lesson:c.lessons.find(l=>l.id===params.slug)};},head:({loaderData})=>seo(loaderData?.lesson?loaderData.lesson.title+' — Leçon':'Leçon ExaCiv',loaderData?.lesson?.body[0]?.slice(0,150)??'Consultez les leçons ExaCiv.'),component:()=>{const {slug}=Route.useParams();return <LessonDetail slug={slug}/>;}});
