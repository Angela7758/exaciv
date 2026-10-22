import {createFileRoute} from '@tanstack/react-router';
import {HelpCentre} from '@/components/site/PublicPreparation';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/faq')({validateSearch:(s:Record<string,unknown>)=>({q:typeof s['q']==='string'?s['q']:''}),head:()=>seo('Centre d’aide ExaCiv','Questions fréquentes, ressources officielles et conseils de préparation.'),component:Page});
function Page(){const s=Route.useSearch();const navigate=Route.useNavigate();return <HelpCentre query={s.q} onQuery={q=>void navigate({search:{q},replace:true,resetScroll:false})}/>;}
