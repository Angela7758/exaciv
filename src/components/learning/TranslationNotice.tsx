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
    <div><Languages/><p>{ui('Les cours, questions, réponses et explications pédagogiques restent en français. Les messages non encore traduits sont affichés en français.')}</p>
      <Button variant="ghost" size="sm" aria-expanded={open} onClick={()=>setOpen(!open)}>{ui(open?'Masquer les détails':'Afficher les détails')}<ChevronDown/></Button>
    </div>
    {open&&<p>{ui('Repli français')} : <span lang="fr" dir="ltr">titres et contenus des leçons, questions, choix de réponse, explications, noms des thèmes officiels, sources et plans de révision pédagogiques.</span></p>}
  </section>;
}