import {useState} from 'react';
import {Languages} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useI18n} from '@/lib/i18n';
import {useUiT} from '@/lib/i18n/internal';

export function FrenchOriginal({texts}:{texts:string[]}) {
  const {locale} = useI18n();
  const ui = useUiT();
  const [open,setOpen] = useState(false);
  if(locale==='fr')return null;
  return <div className="french-original">
    <Button variant="ghost" size="sm" onClick={()=>setOpen(!open)} aria-expanded={open}><Languages/>{ui(open?'Masquer l’original français':'Afficher l’original français')}</Button>
    {open&&<div lang="fr" dir="ltr">{texts.filter(Boolean).map((text,i)=><p key={i}>{text}</p>)}</div>}
  </div>;
}