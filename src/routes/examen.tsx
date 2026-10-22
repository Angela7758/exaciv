import {createFileRoute} from '@tanstack/react-router';
import {ExamIntroduction} from '@/components/site/PublicPreparation';
import {seo} from '@/lib/seo';
export const Route=createFileRoute('/examen')({validateSearch:(s:Record<string,unknown>)=>({demarche:s['demarche']==='resident'?'resident':s['demarche']==='sejour'?'sejour':'naturalisation' as 'naturalisation'|'resident'|'sejour'}),head:()=>seo('Comprendre l’examen civique','Format, seuil de réussite et règles officielles pour chaque démarche.'),component:Page});
function Page(){const s=Route.useSearch();const navigate=Route.useNavigate();return <ExamIntroduction track={s.demarche} onTrack={demarche=>void navigate({search:{demarche}})}/>;}
