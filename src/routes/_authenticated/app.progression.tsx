import {createFileRoute} from '@tanstack/react-router';
import {ProgressAnalytics} from '@/components/learning/ProgressAnalytics';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/progression')({validateSearch:(s:Record<string,unknown>):{demo?:boolean}=>s['demo']===true||s['demo']==='true'?{demo:true}:{},head:()=>seo('Votre progression ExaCiv','Suivez vos leçons, votre activité et vos objectifs de préparation civique.'),component:()=>{const {demo}=Route.useSearch();return <ProgressAnalytics demo={demo??false}/>;}});
