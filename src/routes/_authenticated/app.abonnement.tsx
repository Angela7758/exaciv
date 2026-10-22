import {createFileRoute} from '@tanstack/react-router';
import {Subscription} from '@/components/learning/Subscription';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/abonnement')({validateSearch:(s:Record<string,unknown>):{demo?:boolean}=>s['demo']===true||s['demo']==='true'?{demo:true}:{},head:()=>seo('Choisissez votre rythme','Comparez les formules Découverte, Essentiel et Pass Révision ExaCiv.'),component:Subscription});
