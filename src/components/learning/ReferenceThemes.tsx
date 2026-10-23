import {useUiT} from '@/lib/i18n/internal';
import {Link} from '@tanstack/react-router';
import {Landmark,Users,FileText,ChevronRight,ArrowRight} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {TOPICS,percentage} from '@/config/learning';
import {ProgressBar} from './primitives';
import institutions from '@/assets/reference-institutions.png.asset.json';
import valeurs from '@/assets/reference-valeurs.png.asset.json';
import droits from '@/assets/reference-droits.png.asset.json';
const art=[institutions,valeurs,droits];const icons=[Landmark,Users,FileText];
export function ReferenceThemes({counts,targets,buttons=false,demo=false}:{counts:{done:number;total:number}[];targets:(string|undefined)[];buttons?:boolean;demo?:boolean}){const ui=useUiT();return <div className="approved-theme-grid">{TOPICS.map((t,i)=>{const Icon=icons[i]??BookFallback;const count=counts[i]??{done:0,total:0};const target=targets[i];return <section className={`approved-theme ${t.tone}`} key={t.title}><img src={art[i]?.url} alt=""/><header><Icon/><h3>{t.title}</h3><span>{count.done} / {count.total}{buttons?ui(" leçons"):''}<ChevronRight/></span></header><p>{t.description}</p><div className="approved-theme-progress"><ProgressBar value={percentage(count.done,count.total)} tone={t.tone}/><b>{percentage(count.done,count.total)}%</b></div>{buttons?<Button asChild variant="cta"><Link to={target?'/app/lecons/$slug':'/app/lecons'} params={target?{slug:target}:{}} search={demo?{demo:true}:{}}>{ui("Continuer")}<ArrowRight/></Link></Button>:<Link className="theme-cover-link" aria-label={ui("Ouvrir {0}",t.title)} to={target?'/app/lecons/$slug':'/app/lecons'} params={target?{slug:target}:{}} search={demo?{demo:true}:{}}/>}</section>;})}</div>;}
const BookFallback=Landmark;