import {createFileRoute} from '@tanstack/react-router';
import {DiagnosticResult} from '@/components/learning/DiagnosticResult';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/test-gratuit_/resultat')({validateSearch:(s:Record<string,unknown>):{demo?:boolean}=>({demo:s['demo']===true||s['demo']==='true'}),head:()=>seo('Votre premier bilan','Votre résultat de découverte ExaCiv et vos thèmes à renforcer, sans valeur officielle.'),component:()=> <DiagnosticResult demo={Route.useSearch().demo}/>});