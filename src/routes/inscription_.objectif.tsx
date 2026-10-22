import {createFileRoute} from '@tanstack/react-router';
import {RegistrationObjective} from '@/components/learning/RegistrationObjective';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/inscription_/objectif')({validateSearch:(s:Record<string,unknown>):{demo?:boolean}=>({demo:s['demo']===true||s['demo']==='true'}),head:()=>seo('Créer mon parcours – Objectif','Choisissez votre démarche et votre date d’objectif pour préparer l’examen civique.'),component:()=> <RegistrationObjective demo={Route.useSearch().demo}/>});