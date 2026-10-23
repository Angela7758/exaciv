import {SafeImage} from '@/components/site/SafeImage';
import {useContentT} from '@/lib/i18n/content';
import {useUiT} from '@/lib/i18n/internal';
import {Link} from '@tanstack/react-router';
import {Landmark,Users,FileText,ChevronRight,ArrowRight} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {TOPICS,percentage} from '@/config/learning';
import {ProgressBar} from './primitives';
import {TOPIC_ARTWORK} from '@/config/topic-artwork';
import institutions from '@/assets/reference-institutions.png.asset.json';
import valeurs from '@/assets/reference-valeurs.png.asset.json';
import droits from '@/assets/reference-droits.png.asset.json';
const art=[institutions,valeurs,droits];const icons=[Landmark,Users,FileText];
export function ReferenceThemes({counts,targets,buttons=false,demo=false}:{counts:{done:number;total:number}[];targets:(string|undefined)[];buttons?:boolean;demo?:boolean}){const ui=useUiT();const ct=useContentT();return <div className="approved-theme-grid">{TOPICS.map((t,i)=>{const artwork=TOPIC_ARTWORK[t.art];const Icon=artwork.icon;const count=counts[i]??{done:0,total:0};const target=targets[i];return <section className={`approved-theme ${t.tone}`} key={ct(t.title)}><SafeImage src={artwork.src} fallbackSrc={artwork.src} alt={ct(t.title)} width={1376} height={768} loading="lazy"/><header><Icon/><h3>{ct(t.title)}</h3>{count.total>0&&<span>{count.done} / {count.total}{buttons?ui(" leçons"):''}<ChevronRight/></span>}</header><p>{ct(t.description)}</p>{count.total>0?<div className="approved-theme-progress"><ProgressBar value={percentage(count.done,count.total)} tone={t.tone}/><b>{percentage(count.done,count.total)}%</b></div>:<p className="theme-coming">Bientôt disponible</p>}{count.total>0&&(buttons?<Button asChild variant="cta"><Link to={target?'/app/lecons/$slug':'/app/lecons'} params={target?{slug:target}:{}} search={demo?{demo:true}:{}}>{ui("Continuer")}<ArrowRight/></Link></Button>:<Link className="theme-cover-link" aria-label={ui("Ouvrir {0}",t.title)} to={target?'/app/lecons/$slug':'/app/lecons'} params={target?{slug:target}:{}} search={demo?{demo:true}:{}}/>)}</section>;})}</div>;}
const BookFallback=Landmark;