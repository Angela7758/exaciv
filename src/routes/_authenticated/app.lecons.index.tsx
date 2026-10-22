import {createFileRoute} from '@tanstack/react-router';
import {CourseCatalogue} from '@/components/learning/CourseCatalogue';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/lecons/')({validateSearch:(s:Record<string,unknown>):{demo?:boolean}=>s['demo']===true||s['demo']==='true'?{demo:true}:{},head:()=>seo('Catalogue de leçons ExaCiv','Apprenez les valeurs, institutions, droits et devoirs dans vos leçons ExaCiv.'),component:()=>{const {demo}=Route.useSearch();return <CourseCatalogue demo={demo??false}/>;}});
