import {createFileRoute} from '@tanstack/react-router';
import {SessionErrors} from '@/components/learning/SessionResults';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/erreurs')({validateSearch:(s:Record<string,unknown>):{session?:string}=>typeof s['session']==='string'?{session:s['session']}:{},head:()=>seo('Erreurs','Votre espace personnel de préparation ExaCiv.'),component:()=> {const {session}=Route.useSearch();return <SessionErrors id={session}/>;}});
