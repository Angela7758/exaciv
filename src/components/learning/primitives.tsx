import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import civi from '@/assets/civi.png';
export function LearningCard({children,className=''}:{children:ReactNode;className?:string}) {return <section className={cn('learning-card',className)}>{children}</section>;}
export function ProgressBar({value,tone='blue'}:{value:number;tone?:'blue'|'orange'|'green'}) { return <progress className={`learning-progress ${tone}`} max={100} value={value} aria-label={`Progression : ${value} %`}/>; }
export function StatusPill({children}:{children:ReactNode}) {return <span className="status-pill">{children}</span>;}
export function CiviMessage({message='On continue ?',className=''}:{message?:string;className?:string}) {return <div className={cn('civi-message',className)}><p>{message}</p><img src={civi} alt="CIVI vous encourage"/></div>;}
