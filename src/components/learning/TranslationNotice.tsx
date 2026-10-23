import {useState} from 'react';
import {Languages,ChevronDown} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useI18n} from '@/lib/i18n';
import {useUiT} from '@/lib/i18n/internal';

export function TranslationNotice(){
  const {locale}=useI18n();
  const ui=useUiT();
  const [open,setOpen]=useState(false);
  if(locale==='fr')return null;
  return <section className="translation-notice" aria-label={ui('Langues et contenus')}>
    <div><Languages/><p>{ui('Les traductions pédagogiques sont des aides. Les originaux français et les sources restent disponibles. Les textes manquants utilisent le repli français.')}</p>
      <Button variant="ghost" size="sm" aria-expanded={open} onClick={()=>setOpen(!open)}>{ui(open?'Masquer les détails':'Afficher les détails')}<ChevronDown/></Button>
    </div>
    {open&&<p>{ui('Repli français')} : {ui('Sources officielles et contenus non encore traduits.')}</p>}
  </section>;
}