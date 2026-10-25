import {useUiT} from '@/lib/i18n/internal';
import {ExternalLink} from 'lucide-react';
export function SourceLink({url,label='Voir la source officielle'}:{url?:string|null|undefined;label?:string|undefined}){const ui=useUiT();return url?<a className="source-link" href={url} target="_blank" rel="noopener noreferrer"><ExternalLink/>{ui(label)}</a>:<span className="source-pending">{ui("Source en attente de vérification")}</span>;}
