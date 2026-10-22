import {createFileRoute} from '@tanstack/react-router';
import {Subscription} from '@/components/learning/Subscription';
import {selectedPlan} from '@/lib/preparation-navigation';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/abonnement')({validateSearch:(s:Record<string,unknown>):{demo?:boolean;plan?:'decouverte'|'essentiel'|'pass'}=>({...((s['demo']===true||s['demo']==='true')?{demo:true}:{}),plan:selectedPlan(s['plan'])}),head:()=>seo('Choisissez votre rythme','Comparez les formules Découverte, Essentiel et Pass Révision ExaCiv.'),component:Subscription});
