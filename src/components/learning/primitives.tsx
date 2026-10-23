import {useUiT} from '@/lib/i18n/internal';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import civi from '@/assets/civi.png';
export function LearningCard({children,className=''}:{children:ReactNode;className?:string}) {return <section className={cn('learning-card',className)}>{children}</section>;}
export function ProgressBar({value,tone='blue'}:{value:number;tone?:'blue'|'orange'|'green'}) {const ui=useUiT(); return <progress className={`learning-progress ${tone}`} max={100} value={value} aria-label={ui("Progression : {0} %",value)}/>; }
export function StatusPill({children}:{children:ReactNode}) {return <span className="status-pill">{children}</span>;}
export function CiviMessage({message='On continue ?',className=''}:{message?:string;className?:string}) {const ui=useUiT();return <div className={cn('civi-message',className)}><p>{ui(message)}</p><img src={civi} alt={ui("CIVI vous encourage")}/></div>;}
