import {createFileRoute} from '@tanstack/react-router';
import {useRef,useState} from 'react';
import {AdminFrame} from '@/components/admin/AdminShell';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
export const Route=createFileRoute('/zz-harness')({component:H});
function H(){const [o,setO]=useState(false);const [d,setD]=useState(false);const opener=useRef<HTMLElement|null>(null);return <AdminFrame roles={['admin']} open={o} onOpenChange={setO}><button id="opened" onClick={()=>{opener.current=document.activeElement as HTMLElement;setD(true);}}>Nouvelle question</button><Dialog open={d} onOpenChange={setD}><DialogContent className="admin-editor" onCloseAutoFocus={e=>{const el=opener.current;if(el&&el.isConnected){e.preventDefault();el.focus();}}}><DialogTitle>Nouvelle question</DialogTitle><DialogDescription>x</DialogDescription><div className="admin-form">{Array.from({length:30},(_,i)=><label key={i}>Champ {i}<input/></label>)}</div><div className="admin-actions"><Button variant="cta">Enregistrer</Button></div></DialogContent></Dialog></AdminFrame>;}
