import {createFileRoute} from '@tanstack/react-router';
import {PublicPathways} from '@/components/site/PublicPreparation';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/parcours')({head:()=>seo('Trois parcours pour votre démarche','Naturalisation, carte de résident et carte de séjour pluriannuelle : choisissez votre préparation.'),component:Page});
function Page(){return <PublicPathways/>;}
