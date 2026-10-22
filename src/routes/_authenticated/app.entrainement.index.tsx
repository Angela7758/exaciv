import {createFileRoute} from '@tanstack/react-router';
import {SessionStart} from '@/components/learning/SessionStart';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/_authenticated/app/entrainement/')({validateSearch:(s:Record<string,unknown>):{demo?:boolean}=>s['demo']===true||s['demo']==='true'?{demo:true}:{},head:()=>seo('S’entraîner à son rythme','Choisissez un thème ExaCiv, commencez dix questions ou reprenez votre entraînement enregistré.'),component:()=> <SessionStart demo={Route.useSearch().demo??false}/>});
