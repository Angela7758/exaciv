import {ExternalLink} from 'lucide-react';
export function SourceLink({url,label='Voir la source officielle'}:{url?:string|null|undefined;label?:string}){return url?<a className="source-link" href={url} target="_blank" rel="noopener noreferrer"><ExternalLink/>{label}</a>:<span className="source-pending">Source en attente de vérification</span>;}
