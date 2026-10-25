import {createFileRoute} from '@tanstack/react-router';
import {CourseCatalogue} from '@/components/learning/CourseCatalogue';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/lecons/')({validateSearch:(s:Record<string,unknown>)=>({q:typeof s['q']==='string'?s['q']:'',theme:typeof s['theme']==='string'?s['theme']:'all',state:typeof s['state']==='string'?s['state']:'all',demo:s['demo']===true||s['demo']==='true'}),head:()=>seo('Vos leçons','Apprenez les valeurs, institutions, droits et devoirs dans vos leçons ExaCiv.'),component:()=>{const {demo}=Route.useSearch();return <CourseCatalogue demo={demo??false}/>;}});
