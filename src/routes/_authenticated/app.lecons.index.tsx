import {createFileRoute} from '@tanstack/react-router';
import {CourseCatalogue} from '@/components/learning/CourseCatalogue';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/lecons/')({validateSearch:(s:Record<string,unknown>):{q?:string;theme?:string;state?:string;demo?:boolean}=>({...(typeof s['q']==='string'?{q:s['q']}:{}),...(typeof s['theme']==='string'?{theme:s['theme']}:{}),...(typeof s['state']==='string'?{state:s['state']}:{}),...(s['demo']===true||s['demo']==='true'?{demo:true}:{})}),head:()=>seo('Vos leçons','Apprenez les valeurs, institutions, droits et devoirs dans vos leçons ExaCiv.'),component:()=>{const {demo}=Route.useSearch();return <CourseCatalogue demo={demo??false}/>;}});
